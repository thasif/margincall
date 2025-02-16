import { NextResponse } from 'next/server';
import { listRecordings, getSignedVideoUrl, getFromS3 } from '@/lib/s3';

export async function GET() {
  try {
    // List all recordings from S3
    const result = await listRecordings();
    
    if (!result.Contents) {
      return NextResponse.json({ recordings: [] });
    }

    // Process each recording
    const recordings = await Promise.all(
      result.Contents
        .filter(item => item.Key?.startsWith('videos/')) // Only get video files
        .map(async (item) => {
          if (!item.Key) return null;

          try {
            // Get the video URL
            const videoUrl = await getSignedVideoUrl(item.Key);
            
            // Get the transcription
            // Change path from videos/timestamp-filename to transcriptions/timestamp-transcription.txt
            const transcriptionKey = item.Key
              .replace('videos/', 'transcriptions/')
              .replace(/-[^-]+$/, '-transcription.txt');

            let transcription = '';
            try {
              const transcriptionResult = await getFromS3(transcriptionKey);
              const chunks = [];
              for await (const chunk of transcriptionResult.Body as any) {
                chunks.push(chunk);
              }
              transcription = Buffer.concat(chunks).toString('utf-8');
            } catch (error) {
              console.error('Error fetching transcription:', error);
              transcription = 'Transcription not available';
            }

            // Extract timestamp from the key (format: videos/timestamp-filename)
            const timestamp = item.Key.split('/')[1].split('-')[0];
            
            return {
              id: item.Key,
              videoUrl,
              transcription,
              timestamp,
              duration: 0, // We'll need to add duration to the upload metadata if needed
              lastModified: item.LastModified?.toISOString() || new Date().toISOString()
            };
          } catch (error) {
            console.error('Error processing recording:', error);
            return null;
          }
        })
    );

    // Filter out any null values and sort recordings
    const validRecordings = recordings.filter((recording): recording is NonNullable<typeof recording> => 
      recording !== null
    );

    // Sort recordings by timestamp (newest first)
    validRecordings.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

    return NextResponse.json({ recordings: validRecordings });
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return NextResponse.json(
      { recordings: [], error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}