// components/RecordingHistory.tsx
import React from 'react';

interface Recording {
  timestamp: number;
  videoKey: string;
  transcriptionKey: string;
  transcription: string;
}

interface RecordingHistoryProps {
  recordings: Recording[];
}

const RecordingHistory: React.FC<RecordingHistoryProps> = ({ recordings }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recording History</h2>
      <div className="space-y-4">
        {recordings.map((recording) => (
          <div key={recording.timestamp} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">
                {formatDate(recording.timestamp)}
              </span>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-2">
              <video
                src={`${process.env.NEXT_PUBLIC_S3_URL}/${recording.videoKey}`}
                controls
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <h3 className="text-sm font-medium mb-1">Transcription:</h3>
              <p className="text-sm text-gray-600">{recording.transcription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingHistory;