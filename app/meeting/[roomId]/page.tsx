import MeetingRoom from '@/components/MeetingRoom';

export default function MeetingRoomPage({ 
  params 
}: { 
  params: { roomId: string } 
}) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <MeetingRoom roomId={params.roomId} />
    </div>
  );
}