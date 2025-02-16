import { Metadata } from 'next';
import MeetingRoom from '@/components/MeetingRoom';

type Props = {
  params: Promise<{ roomId: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: 'Meeting Room',
  description: 'Join a video meeting',
};

export default async function Page({ params }: Props) {
  const { roomId } = await params;
  //const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <MeetingRoom roomId={roomId} />
    </div>
  );
}
