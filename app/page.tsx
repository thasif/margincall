import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';

export const metadata: Metadata = {
  title: 'Margin Call - Mental Health Support',
  description: 'Professional therapy and counseling services tailored to your needs',
  keywords: 'therapy, counseling, mental health, online therapy, mental wellness',
};

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
    </main>
  );
}