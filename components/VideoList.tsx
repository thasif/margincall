// components/VideoList.tsx
import React from 'react';
import { Search, Calendar, Clock, AlertCircle } from 'lucide-react';
import type { VideoListProps } from '../types/therapist';

const VideoList: React.FC<VideoListProps> = ({
  recordings,
  selectedRecording,
  onSelectRecording,
  searchTerm,
  onSearchChange,
}) => {
  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredRecordings = recordings.filter(recording => 
    recording.transcription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (recordings.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-lg">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <p>No recordings found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search recordings..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 
              transition-all duration-200"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Selected Video */}
      {selectedRecording && (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-green-500 
          transform transition-all duration-200 hover:shadow-2xl">
          <div className="aspect-video bg-gray-900 relative group">
            <video
              src={selectedRecording.videoUrl}
              className="w-full h-full object-cover"
              controls
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white 
              text-sm flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(selectedRecording.duration)}</span>
            </div>
          </div>
          <div className="p-4 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{formatDate(selectedRecording.timestamp)}</span>
              </div>
              <span className="text-green-600 font-medium">Currently Selected</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 hover:line-clamp-none">
              {selectedRecording.transcription}
            </p>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-4 text-sm text-gray-500">Other Recordings</span>
        </div>
      </div>

      {/* Other Videos */}
      <div className="space-y-4 max-h-[calc(100vh-32rem)] overflow-y-auto pr-2 
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {filteredRecordings
          .filter(recording => recording.id !== selectedRecording?.id)
          .map((recording) => (
            <div
              key={recording.id}
              onClick={() => onSelectRecording(recording)}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer 
                transition-all duration-200 hover:shadow-xl opacity-90 hover:opacity-100 
                transform hover:-translate-y-1"
            >
              <div className="aspect-video bg-gray-900 relative group">
                <video
                  src={recording.videoUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
                  transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                    bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Click to Select
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white 
                  text-sm flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(recording.duration)}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(recording.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 group-hover:line-clamp-none">
                  {recording.transcription}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VideoList;