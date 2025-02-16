// Recording Types
export interface Recording {
  id: string;
  videoUrl: string;
  transcription: string;
  timestamp: string;
  duration: number;
  lastModified: string;
}

// Analysis Types
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

// Detailed Analysis Types
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

// Therapist Types
export interface Therapist {
  id: string;
  name: string;
  title: string;
  license: string;
  specialties: string[];
  languages: string[];
  experience: string;
  rating: number;
  reviews: number;
  availability: {
    nextAvailable: string;
    schedule: {
      day: string;
      slots: string[];
    }[];
  };
  pricing: {
    standardRate: number;
    proBono: boolean;
    slidingScale: boolean;
    insurance: string[];
  };
  profile: {
    bio: string;
    approach: string;
    education: string[];
    certifications: string[];
  };
}

// Session Types
export interface Session {
  id: string;
  therapistId: string;
  clientId: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'chat';
  notes?: {
    content: string;
    timestamp: string;
    author: string;
  }[];
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
  model: {
    name: string;
    version: string;
    parameters: Record<string, unknown>;
  };
}

// Error Types
export interface TherapistError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Utility Types
export type TherapistSpecialty = 
  | 'Anxiety'
  | 'Depression'
  | 'Trauma'
  | 'PTSD'
  | 'Relationships'
  | 'Addiction'
  | 'Grief'
  | 'Stress'
  | 'Career'
  | 'Family';

export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export type AvailabilitySlot = {
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'blocked';
};