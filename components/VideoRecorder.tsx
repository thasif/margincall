'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Upload, Clock } from 'lucide-react';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

// Extend Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Recording {
  id: number;
  timestamp: string;
  videoUrl: string;
  transcription: string;
  videoKey?: string;
  transcriptionKey?: string;
}

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcription, setTranscription] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize camera and speech recognition
  useEffect(() => {
    const initializeDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          
          recognition.continuous = true;
          recognition.interimResults = true;
          
          recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
              } else {
                interimTranscript += transcript;
              }
            }

            setTranscription(prev => prev + finalTranscript);
            if (interimTranscript) {
              // Show interim results in a different style
              const transcriptElement = document.getElementById('interim-transcript');
              if (transcriptElement) {
                transcriptElement.textContent = interimTranscript;
              }
            }
          };

          recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
          };

          recognitionRef.current = recognition;
        }
      } catch (err) {
        console.error('Error accessing devices:', err);
      }
    };

    initializeDevices();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    if (streamRef.current) {
      // Start media recording
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      chunksRef.current = [];
      setTranscription('');

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorderRef.current.start();
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!videoUrl || !transcription) return;
  
    setIsUploading(true);
    try {
      const videoBlob = await fetch(videoUrl).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', videoBlob, 'recording.webm');
      formData.append('transcription', transcription);
      formData.append('duration', recordingTime.toString());
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Upload failed');
  
      const result = await response.json();
      
      if (result.success) {
        const newRecording: Recording = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          videoUrl: videoUrl,
          transcription: transcription,
          videoKey: result.videoKey,
          transcriptionKey: result.transcriptionKey
        };
  
        setRecordings(prev => [newRecording, ...prev]);
        setVideoUrl(null);
        setTranscription('');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !isCameraOn;
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !isMicOn;
      setIsMicOn(!isMicOn);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Recording Section */}
          <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-xl p-6 border border-white/50">
            <h2 className="text-2xl font-semibold mb-4 text-green-800">Video Recording</h2>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative mb-4 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {videoUrl && !isRecording && (
                <video
                  src={videoUrl}
                  controls
                  className="absolute inset-0 w-full h-full"
                />
              )}
              
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  {formatTime(recordingTime)}
                </div>
              )}

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={toggleCamera}
                  className={`p-2 rounded-full ${isCameraOn ? 'bg-green-500' : 'bg-gray-500'} 
                    shadow-lg transition-all duration-200 hover:scale-105`}
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={toggleMic}
                  className={`p-2 rounded-full ${isMicOn ? 'bg-green-500' : 'bg-gray-500'}
                    shadow-lg transition-all duration-200 hover:scale-105`}
                >
                  <Mic className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 
                    flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="w-3 h-3 rounded-full bg-white" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600
                    shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Stop Recording
                </button>
              )}
              {videoUrl && !isRecording && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 
                    disabled:bg-gray-400 flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Upload className="w-5 h-5" />
                  {isUploading ? 'Uploading...' : 'Save Recording'}
                </button>
              )}
            </div>
          </div>

          {/* Live Transcription Section */}
          <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-xl p-6 border border-white/50">
            <h2 className="text-2xl font-semibold mb-4 text-green-800">Live Transcription</h2>
            <div className="h-[400px] bg-white/50 rounded-lg p-4 overflow-y-auto shadow-inner">
              {isRecording ? (
                <>
                  <p className="whitespace-pre-wrap text-gray-700">{transcription}</p>
                  <p id="interim-transcript" className="text-gray-500 italic"></p>
                </>
              ) : transcription ? (
                <p className="whitespace-pre-wrap text-gray-700">{transcription}</p>
              ) : (
                <p className="text-green-700">
                  Start recording to see live transcription
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recording History */}
        <div className="mt-8 backdrop-blur-sm bg-white/80 rounded-xl shadow-xl p-6 border border-white/50">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Recording History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((recording) => (
              <div key={recording.id} 
                className="bg-white/50 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3 shadow-inner">
                  <video src={recording.videoUrl} controls className="w-full h-full" />
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{recording.timestamp}</span>
                </div>
                <div className="bg-white/70 rounded p-3 max-h-32 overflow-y-auto shadow-inner">
                  <p className="text-sm text-gray-700">{recording.transcription}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;