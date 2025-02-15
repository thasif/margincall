// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const transcription = formData.get('transcription') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const timestamp = new Date().getTime();
    const videoKey = `videos/${timestamp}-${file.name}`;
    const transcriptionKey = `transcriptions/${timestamp}-transcription.txt`;

    // Upload video
    const videoBuffer = Buffer.from(await file.arrayBuffer());
    await uploadToS3(videoBuffer, videoKey);

    // Upload transcription
    await uploadToS3(transcription, transcriptionKey);

    return NextResponse.json({
      success: true,
      videoKey,
      transcriptionKey,
      timestamp,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}