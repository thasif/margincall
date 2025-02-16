import type { Metadata } from 'next';
import LandingPage from '@/components/LandingPage';

export const metadata: Metadata = {
  title: 'MICO - Mental Health Support',
  description: 'Professional therapy and counseling services tailored to your needs',
  keywords: 'therapy, counseling, mental health, online therapy, mental wellness',
};

export default function Home() {
  return <LandingPage />;
}