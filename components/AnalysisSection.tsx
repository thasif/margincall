import React from 'react';
import { AlertTriangle, Brain, Heart, LineChart } from 'lucide-react';
import type { 
  AnalysisCardProps, 
  AnalysisSectionProps 
} from '@/types/therapist';

interface ExtendedAnalysisCardProps extends AnalysisCardProps {
  bgColor: string;
  iconColor: string;
}

const AnalysisCard: React.FC<ExtendedAnalysisCardProps> = ({ 
  title, 
  icon, 
  children, 
  bgColor, 
  iconColor 
}) => (
  <div className={`${bgColor} rounded-lg shadow-lg p-6 h-full`}>
    <div className="flex items-center gap-2 mb-4">
      <div className={`${iconColor} p-2 rounded-full bg-white/90`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const AnalysisGrid: React.FC<AnalysisSectionProps> = ({ recording, analysis }) => {
  if (!recording || !analysis) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Select a recording to view AI analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Emotional State Analysis */}
      <AnalysisCard 
        title="Emotional State Analysis" 
        icon={<Heart className="w-5 h-5" />}
        bgColor="bg-red-50"
        iconColor="text-red-500"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Primary Emotion:</span>
            <span className="font-medium text-red-600">{analysis.emotionalState.primary}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Intensity:</span>
            <span className="font-medium text-red-600">{analysis.emotionalState.intensity}</span>
          </div>
          <div>
            <span className="text-gray-600 block mb-2">Triggers:</span>
            <div className="flex flex-wrap gap-2">
              {analysis.emotionalState.triggers.map((trigger: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white text-red-600 rounded-full text-sm">
                  {trigger}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnalysisCard>

      {/* Risk Assessment */}
      <AnalysisCard 
        title="Risk Assessment" 
        icon={<AlertTriangle className="w-5 h-5" />}
        bgColor="bg-amber-50"
        iconColor="text-amber-500"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Risk Level:</span>
            <span className="font-medium text-amber-600">{analysis.riskAssessment.level}</span>
          </div>
          <div>
            <span className="text-gray-600 block mb-2">Key Concerns:</span>
            <ul className="space-y-2">
              {analysis.riskAssessment.concerns.map((concern: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnalysisCard>

      {/* Therapeutic Insights */}
      <AnalysisCard 
        title="Therapeutic Insights" 
        icon={<Brain className="w-5 h-5" />}
        bgColor="bg-blue-50"
        iconColor="text-blue-500"
      >
        <div className="space-y-3">
          <div>
            <span className="text-gray-600 block mb-2">Patterns:</span>
            <div className="flex flex-wrap gap-2">
              {analysis.therapeuticInsights.patterns.map((pattern: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-600 block mb-2">Strengths:</span>
            <div className="flex flex-wrap gap-2">
              {analysis.therapeuticInsights.strengths.map((strength: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white text-green-600 rounded-full text-sm">
                  {strength}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnalysisCard>

      {/* Sentiment Analysis */}
      <AnalysisCard 
        title="Sentiment Analysis" 
        icon={<LineChart className="w-5 h-5" />}
        bgColor="bg-purple-50"
        iconColor="text-purple-500"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Overall:</span>
            <span className="font-medium text-purple-600">{analysis.sentiment.overall}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Progression:</span>
            <span className="font-medium text-purple-600">{analysis.sentiment.progression}</span>
          </div>
          <div>
            <span className="text-gray-600 block mb-2">Variations:</span>
            <div className="flex flex-wrap gap-2">
              {analysis.sentiment.variations.map((variation: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white text-purple-600 rounded-full text-sm">
                  {variation}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnalysisCard>
    </div>
  );
};

export default AnalysisGrid;