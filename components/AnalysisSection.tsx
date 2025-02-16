// components/AnalysisSection.tsx
import React from 'react';
import { AlertTriangle, Brain, Heart, LineChart } from 'lucide-react';
import { Recording, AIAnalysis } from '../types/therapist';

interface AnalysisSectionProps {
  recording: Recording | null;
  analysis: AIAnalysis | null;
}

const AnalysisCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ recording, analysis }) => {
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
    <div className="space-y-4">
      {/* Emotional State Analysis */}
      <AnalysisCard title="Emotional State Analysis" icon={<Heart className="w-5 h-5 text-red-500" />}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Primary Emotion:</span>
            <span className="font-medium text-red-600">{analysis.emotionalState.primary}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Intensity:</span>
            <span className="font-medium text-orange-500">{analysis.emotionalState.intensity}</span>
          </div>
          <div>
            <span className="text-gray-600">Triggers:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.emotionalState.triggers.map((trigger, i) => (
                <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-sm">
                  {trigger}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnalysisCard>

      {/* Risk Assessment */}
      <AnalysisCard title="Risk Assessment" icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Risk Level:</span>
            <span className="font-medium text-yellow-600">{analysis.riskAssessment.level}</span>
          </div>
          <div>
            <span className="text-gray-600">Key Concerns:</span>
            <ul className="mt-1 space-y-1">
              {analysis.riskAssessment.concerns.map((concern, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {concern}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-gray-600">Recommendations:</span>
            <ul className="mt-1 space-y-1">
              {analysis.riskAssessment.recommendations.map((rec, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnalysisCard>

      {/* Therapeutic Insights */}
      <AnalysisCard title="Therapeutic Insights" icon={<Brain className="w-5 h-5 text-blue-500" />}>
        <div className="space-y-3">
          <div>
            <span className="text-gray-600">Identified Patterns:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.therapeuticInsights.patterns.map((pattern, i) => (
                <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Strengths:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.therapeuticInsights.strengths.map((strength, i) => (
                <span key={i} className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                  {strength}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Challenges:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.therapeuticInsights.challenges.map((challenge, i) => (
                <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-sm">
                  {challenge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnalysisCard>

      {/* Sentiment Analysis */}
      <AnalysisCard title="Sentiment Analysis" icon={<LineChart className="w-5 h-5 text-purple-500" />}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Overall Sentiment:</span>
            <span className="font-medium text-purple-600">{analysis.sentiment.overall}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Progression:</span>
            <span className="font-medium text-blue-600">{analysis.sentiment.progression}</span>
          </div>
          <div>
            <span className="text-gray-600">Emotional Variations:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.sentiment.variations.map((variation, i) => (
                <span key={i} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">
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

export default AnalysisSection;