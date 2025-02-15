import { getServerSession } from 'next-auth/next';
import LoginButton from '@/components/LoginButton';
import LandingPage from '@/components/LandingPage';

export default function Home() {
   return <LandingPage />;
  //(
  //   <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
  //     <div className="bg-white p-8 rounded-lg shadow-md">
  //       <h1 className="text-3xl font-bold mb-6">Welcome to Audio Rants</h1>
  //       <p className="mb-6">Share your thoughts through voice recordings</p>
  //       <a
  //         href="/record"
  //         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  //       >
  //         Sign In
  //       </a>
  //     </div>
  //   </div>
  // );
}