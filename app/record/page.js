import VideoRecorder from '@/components/VideoRecorder';

export default function RecordPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-800">Share your thoughts</h1>
      <VideoRecorder />
    </div>
  );
}