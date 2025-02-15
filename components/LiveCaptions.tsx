import React, { useState, useEffect, useRef } from 'react';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

interface LiveCaptionsProps {
  audioStream: MediaStream | null;
  isRecording: boolean;
  setTranscription: (transcription: string) => void;
}

const LiveCaptions: React.FC<LiveCaptionsProps> = ({ audioStream, isRecording, setTranscription }) => {
  const [tempTranscript, setTempTranscript] = useState<string>('');
  const recognizerRef = useRef<speechsdk.SpeechRecognizer | null>(null);

  useEffect(() => {
    if (!audioStream || !isRecording) {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
        recognizerRef.current = null; // Clear the ref
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

    recognizer.recognizing = (_: speechsdk.Recognizer, e: speechsdk.SpeechRecognitionEventArgs) => {
      setTempTranscript(e.result.text);
    };

    recognizer.recognized = (_: speechsdk.Recognizer, e: speechsdk.SpeechRecognitionEventArgs) => {
      if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        setTranscription(prev => `${prev} ${e.result.text}`);
        setTempTranscript(''); // Clear temporary transcript
      }
    };

    recognizer.sessionStopped = () => {
      console.log("Speech recognition session stopped");
      recognizer.stopContinuousRecognitionAsync(); // Ensure it stops
    };

    recognizer.canceled = (sender: speechsdk.Recognizer, cancellationEventArgs: speechsdk.SpeechRecognitionCanceledEventArgs) => {
      console.log("Speech recognition canceled: " + cancellationEventArgs.reason);
      if (cancellationEventArgs.reason === speechsdk.CancellationReason.Error) {
        console.error("Error details: " + cancellationEventArgs.errorDetails);
      }
      recognizer.stopContinuousRecognitionAsync(); // Ensure it stops
    };

    recognizer.startContinuousRecognitionAsync();
    recognizerRef.current = recognizer;

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
      }
    };
  }, [audioStream, isRecording, setTranscription]);

  return (
    <div className="absolute bottom-16 left-0 right-0 p-4">
      <div className="bg-black bg-opacity-50 text-white p-2 rounded text-center">
        {tempTranscript || 'Listening...'}
      </div>
    </div>
  );
};

export default LiveCaptions;
