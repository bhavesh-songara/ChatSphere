"use client";

import { fetcher } from "@/lib/fetcher";
import { getAudioTranscription } from "@/lib/gladia";
import { useRef, useState } from "react";

export const useChatBot = () => {
  const [isListening, setListening] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [isProcessing, setProcessing] = useState(false);

  const [messages, setMessages] = useState<
    Array<{
      text: string;
      role: "bot" | "user";
      botName?: string;
    }>
  >([]);

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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        setAudio(audioBlob);

        const formData = new FormData();

        formData.append("audio", audioBlob);

        const transcriptionResult = await fetcher({
          url: "/api/transcription",
          method: "POST",
          data: formData,
        });

        if (transcriptionResult?.error) {
          console.error("Transcription error", transcriptionResult.error);
        }

        const transcriptText = transcriptionResult?.data?.text as string;

        setMessages((prev) => [
          ...prev,
          {
            text: transcriptText,
            role: "user",
          },
        ]);

        const { data } = await fetcher({
          url: "/api/chat",
          method: "POST",
          data: {
            messages: [
              ...messages,
              {
                text: transcriptText,
                role: "user",
              },
            ],
          },
        });

        data?.messages?.forEach((message: any) => {
          const utterance = new SpeechSynthesisUtterance(message.text);
          speechSynthesis.speak(utterance);
        });

        setMessages((prev) => [...prev, ...(data.messages || [])]);

        setProcessing(false);
      };

      speechSynthesis.cancel();

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
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    isProcessing,
    audio,
    messages,
  };
};
