'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Copy, AlertCircle } from 'lucide-react';
import LiveCaptions from './LiveCaptions';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const meetingLink = typeof window !== 'undefined' ? 
    `${window.location.origin}/meeting/${roomId}` : '';

  // Initialize WebRTC and local stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Initialize peer connection
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        
        peerConnectionRef.current = pc;
        
        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          if (pc && localStreamRef.current) {
            pc.addTrack(track, localStreamRef.current);
          }
        });
        
        // Handle incoming streams
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
        
        setIsConnected(true);
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    initializeMedia();
    
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !isCameraOn;
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !isMicOn;
      setIsMicOn(!isMicOn);
    }
  };

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Meeting Room</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={meetingLink}
            readOnly
            className="px-3 py-2 border rounded-lg w-96 bg-gray-50"
          />
          <button
            onClick={copyMeetingLink}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            <Copy className="w-5 h-5" />
          </button>
          {copySuccess && (
            <span className="text-green-500 text-sm">Link copied!</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Local video */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
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
          </div>
        </div>

        {/* Remote video */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {isConnected ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Waiting for participant to join...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transcription */}
      {localStreamRef.current && (
        <LiveCaptions
          audioStream={localStreamRef.current}
          isRecording={true}
          setTranscription={setTranscription}
        />
      )}

      {transcription && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;