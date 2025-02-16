// components/LiveCaptions.tsx
import React, { useState, useEffect, useRef } from 'react';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

interface LiveCaptionsProps {
  audioStream: MediaStream | null;
  isRecording: boolean;
  onTranscriptionUpdate: (text: string) => void;
}

const LiveCaptions: React.FC<LiveCaptionsProps> = ({ 
  audioStream, 
  isRecording, 
  onTranscriptionUpdate 
}) => {
  const [tempTranscript, setTempTranscript] = useState<string>('');
  const recognizerRef = useRef<speechsdk.SpeechRecognizer | null>(null);

  useEffect(() => {
    if (!audioStream || !isRecording) {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
        recognizerRef.current = null;
      }
      return;
    }

    const speechConfig = speechsdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY ?? '',
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION ?? ''
    );
    speechConfig.speechRecognitionLanguage = 'en-US';

    const audioConfig = speechsdk.AudioConfig.fromStreamInput(audioStream);
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizing = (_, e) => {
      setTempTranscript(e.result.text);
    };

    recognizer.recognized = (_, e) => {
      if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        onTranscriptionUpdate(e.result.text);
        setTempTranscript('');
      }
    };

    recognizer.startContinuousRecognitionAsync();
    recognizerRef.current = recognizer;

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
      }
    };
  }, [audioStream, isRecording, onTranscriptionUpdate]);

  return (
    <div className="absolute bottom-16 left-0 right-0 p-4">
      <div className="bg-black bg-opacity-50 text-white p-2 rounded text-center">
        {tempTranscript || 'Listening...'}
      </div>
    </div>
  );
};

export default LiveCaptions;