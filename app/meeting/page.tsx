import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';

export default function MeetingPage() {
  // Generate a unique room ID and redirect to it
  const roomId = nanoid();
  redirect(`/meeting/${roomId}`);
}