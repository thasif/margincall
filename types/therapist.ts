// types/therapist.ts

export interface Recording {
    id: string;
    videoUrl: string;
    transcription: string;
    timestamp: string;
    duration: number;
    lastModified: string;
  }
  
  export interface EmotionalState {
    primary: string;
    intensity: string;
    triggers: string[];
    description: string;
  }
  
  export interface RiskAssessment {
    level: string;
    concerns: string[];
    urgency: string;
    recommendations: string[];
  }
  
  export interface TherapeuticInsights {
    patterns: string[];
    strengths: string[];
    challenges: string[];
    suggestedApproaches: string[];
  }
  
  export interface Sentiment {
    overall: string;
    progression: string;
    variations: string[];
  }
  
  export interface AIAnalysis {
    emotionalState: EmotionalState;
    riskAssessment: RiskAssessment;
    therapeuticInsights: TherapeuticInsights;
    sentiment: Sentiment;
    keyTopics: string[];
  }
  
  // Component Props Interfaces
  export interface VideoListProps {
    recordings: Recording[];
    selectedRecording: Recording | null;
    onSelectRecording: (recording: Recording) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
  }
  
  export interface AnalysisSectionProps {
    recording: Recording | null;
    analysis: AIAnalysis | null;
  }
  
  export interface AnalysisCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }
  
  // API Response Types
  export interface RecordingsResponse {
    recordings: Recording[];
    error?: string;
  }
  
  export interface UploadResponse {
    success: boolean;
    videoKey?: string;
    transcriptionKey?: string;
    timestamp?: number;
    error?: string;
  }
  
  // Analysis Result Types
  export interface EmotionScore {
    emotion: string;
    score: number;
  }
  
  export interface TopicScore {
    topic: string;
    relevance: number;
  }
  
  export interface RiskLevel {
    category: string;
    level: 'Low' | 'Moderate' | 'High';
    details: string;
  }
  
  export interface TherapyRecommendation {
    approach: string;
    rationale: string;
    priority: 'Low' | 'Medium' | 'High';
  }
  
  // State Management Types
  export interface RecordingsState {
    recordings: Recording[];
    selectedRecording: Recording | null;
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
  }
  
  export interface AnalysisState {
    currentAnalysis: AIAnalysis | null;
    isAnalyzing: boolean;
    error: string | null;
  }
  
  // Filter and Sort Types
  export interface FilterOptions {
    dateRange?: {
      start: Date;
      end: Date;
    };
    emotionalStates?: string[];
    riskLevels?: string[];
    keywords?: string[];
  }
  
  export interface SortOption {
    field: keyof Recording | 'relevance';
    direction: 'asc' | 'desc';
  }
  
  // Metadata Types
  export interface RecordingMetadata {
    duration: number;
    fileSize: number;
    format: string;
    quality: string;
    transcriptionStatus: 'pending' | 'completed' | 'failed';
  }
  
  export interface AnalysisMetadata {
    version: string;
    timestamp: string;
    confidence: number;
    processingTime: number;
  }