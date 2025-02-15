'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4 text-white">
      <nav className="flex flex-col h-full">
        <div className="flex-grow">
          <Link 
            href="/record" 
            className="block py-2 px-4 hover:bg-gray-700 rounded mb-2"
          >
            Record
          </Link>
          <Link 
            href="/history" 
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            History
          </Link>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}