// components/VideoRecorder.tsx
'use client'
import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Mic, Maximize2, MinimizeIcon } from 'lucide-react';
import LiveCaptions from './LiveCaptions';
import RecordingHistory from './RecordingHistory';

interface Recording {
  timestamp: number;
  videoKey: string;
  transcriptionKey: string;
  transcription: string;
}

export default function VideoRecorder() {
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [devices, setDevices] = useState<{ 
    videoDevices: MediaDeviceInfo[], 
    audioDevices: MediaDeviceInfo[] 
  }>({
    videoDevices: [],
    audioDevices: []
  });
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAvailableDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      setDevices({ videoDevices, audioDevices });
      
      if (videoDevices.length && !selectedCamera) setSelectedCamera(videoDevices[0].deviceId);
      if (audioDevices.length && !selectedMic) setSelectedMic(audioDevices[0].deviceId);
    } catch (err) {
      console.error('Error getting devices:', err);
    }
  }, [selectedCamera, selectedMic]);

  const initializeCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: selectedCamera ? { deviceId: selectedCamera } : true,
        audio: selectedMic ? { deviceId: selectedMic } : true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }, [selectedCamera, selectedMic]);

  useEffect(() => {
    getAvailableDevices();
    initializeCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [getAvailableDevices, initializeCamera]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDeviceChange = useCallback(async (deviceId: string, type: string) => {
    if (type === 'video') {
      setSelectedCamera(deviceId);
    } else {
      setSelectedMic(deviceId);
    }

    if (!isRecording) {
      await initializeCamera();
    }
  }, [isRecording, initializeCamera]);

  const startRecording = async () => {
    try {
      await initializeCamera();

      if (streamRef.current) {
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
        setIsRecording(true);
      }
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      streamRef.current?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      initializeCamera();
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result: {
        timestamp: number;
        videoKey: string;
        transcriptionKey: string;
      } = await response.json();
      
      setRecordings(prev => [{
        timestamp: result.timestamp,
        videoKey: result.videoKey,
        transcriptionKey: result.transcriptionKey,
        transcription,
      }, ...prev]);

      setVideoUrl(null);
      setTranscription('');
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload recording. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleCamera = useCallback(() => {
    setIsCameraOn(prev => !prev);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
    }
  }, [isCameraOn]);

  const toggleMic = useCallback(() => {
    setIsMicOn(prev => !prev);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
    }
  }, [isMicOn]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="mb-4 flex gap-4">
        <select 
          value={selectedCamera}
          onChange={(e) => handleDeviceChange(e.target.value, 'video')}
          className="p-2 border rounded"
        >
          {devices.videoDevices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>
        <select 
          value={selectedMic}
          onChange={(e) => handleDeviceChange(e.target.value, 'audio')}
          className="p-2 border rounded"
        >
          {devices.audioDevices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>
      </div>

      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
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
            className="w-full h-full object-cover"
          />
        )}
        
        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {formatTime(recordingTime)}
          </div>
        )}

        {isRecording && streamRef.current && (
          <LiveCaptions 
            audioStream={streamRef.current} 
            isRecording={isRecording}
            setTranscription={setTranscription}
          />
        )}

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={toggleCamera}
            className={`p-2 rounded-full ${isCameraOn ? 'bg-blue-500' : 'bg-gray-500'}`}
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={toggleMic}
            className={`p-2 rounded-full ${isMicOn ? 'bg-blue-500' : 'bg-gray-500'}`}
          >
            <Mic className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-gray-500"
          >
            {isFullscreen ? (
              <MinimizeIcon className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-center mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <span className="w-3 h-3 rounded-full bg-white" />
            Record
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Stop
          </button>
        )}
        {videoUrl && !isRecording && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isUploading ? 'Uploading...' : 'Upload & Transcribe'}
          </button>
        )}
      </div>

      {transcription && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
      
      <RecordingHistory recordings={recordings} />
    </div>
  );
}