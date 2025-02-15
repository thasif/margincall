'use client';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useState } from 'react';

export default function AudioRecorder() {
  const [isUploading, setIsUploading] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    video: false,
  });

  const handleUpload = async () => {
    if (!mediaBlobUrl) return;

    setIsUploading(true);
    try {
      const blob = await fetch(mediaBlobUrl).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      // Trigger transcription
      const { fileKey } = await response.json();
      await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <p>Status: {status}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={startRecording}
          disabled={status === 'recording'}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={status !== 'recording'}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Stop Recording
        </button>
        <button
          onClick={handleUpload}
          disabled={!mediaBlobUrl || isUploading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {mediaBlobUrl && (
        <div className="mt-4">
          <audio src={mediaBlobUrl} controls />
        </div>
      )}
    </div>
  );
}