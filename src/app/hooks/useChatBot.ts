"use client";

import { useRef, useState } from "react";

export const useChatBot = () => {
  const [isListening, setListening] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [isProcessing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        setAudio(audioBlob);
      };

      mediaRecorder.start();
      setListening(true);
      console.log("Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopListening = async () => {
    setListening(false);

    setProcessing(true);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();

      console.log("Recording stopped.");
    }

    await new Promise((resolve) =>
      setTimeout(() => {
        setProcessing(false);
        resolve("okay");
      }, 2000)
    );
  };

  return {
    isListening,
    startListening,
    stopListening,
    isProcessing,
    audio,
  };
};
