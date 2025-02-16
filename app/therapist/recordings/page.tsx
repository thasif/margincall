// TherapistRecordingsView.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { Recording } from '@/types/therapist';
import AnalysisSection from '@/components/AnalysisSection';
import VideoList from '@/components/VideoList';


// Mock AI analysis function (in production this would come from your backend)
const generateAIAnalysis = (transcription: string) => ({
  emotionalState: {
    primary: 'Anxiety',
    intensity: 'High',
    triggers: ['work pressure', 'social situations'],
    description: 'Shows significant signs of anxiety, particularly in professional and social contexts'
  },
  riskAssessment: {
    level: 'Moderate',
    concerns: ['sleep disruption', 'social withdrawal'],
    urgency: 'Medium',
    recommendations: ['Regular check-ins', 'Stress management techniques']
  },
  therapeuticInsights: {
    patterns: ['perfectionist tendencies', 'self-criticism'],
    strengths: ['self-awareness', 'willingness to seek help'],
    challenges: ['work-life balance', 'setting boundaries'],
    suggestedApproaches: ['CBT', 'Mindfulness training']
  },
  sentiment: {
    overall: 'Negative',
    progression: 'Stable',
    variations: ['frustration', 'hope', 'worry']
  },
  keyTopics: [
    'work stress',
    'relationship concerns',
    'self-esteem',
    'future uncertainty'
  ]
});

const TherapistRecordingsView = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  useEffect(() => {
    // Simulated API call
    const fetchRecordings = async () => {
      try {
        const response = await fetch('/api/recordings');
        if (!response.ok) throw new Error('Failed to fetch recordings');
        const data = await response.json();
        setRecordings(data.recordings || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  useEffect(() => {
    if (selectedRecording) {
      const generatedAnalysis = generateAIAnalysis(selectedRecording.transcription);
      setAnalysis(generatedAnalysis);
    } else {
      setAnalysis(null);
    }
  }, [selectedRecording]);

  const handleSelectRecording = (recording: Recording) => {
    setSelectedRecording(recording);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Video List */}
          <div className="col-span-5 space-y-4">
            <VideoList
              recordings={recordings}
              selectedRecording={selectedRecording}
              onSelectRecording={handleSelectRecording}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Right Column - Analysis */}
          <div className="col-span-7">
            <AnalysisSection recording={selectedRecording} analysis={analysis} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistRecordingsView;
