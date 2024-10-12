"use server";

import { fetcher } from "./fetcher";

const gladiaApiUrl = "https://api.gladia.io";
const gladiaApiKey = process.env.GLADIA_API_KEY as string;

async function uploadAudio(formData: FormData) {
  const { data, error } = await fetcher({
    url: `${gladiaApiUrl}/v2/upload`,
    method: "POST",
    headers: {
      "x-gladia-key": gladiaApiKey,
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });

  return {
    audioUrl: data?.audio_url,
  };
}

async function getTranscriptionUrl(audioUrl: string) {
  const { data, errorMessage } = await fetcher({
    url: `${gladiaApiUrl}/v2/transcription`,
    method: "POST",
    headers: {
      "x-gladia-key": gladiaApiKey,
      "Content-Type": "application/json",
    },
    data: {
      audio_url: audioUrl,
    },
  });

  return {
    transcriptionUrl: data?.result_url,
  };
}

async function getTranscription(transcriptionUrl: string) {
  const { data, error } = await fetcher({
    url: transcriptionUrl,
    method: "GET",
    headers: {
      "x-gladia-key": gladiaApiKey,
    },
  });

  const { status, result } = data || {};

  return { status, result };
}

export async function getAudioTranscription(formData: FormData) {
  const { audioUrl } = await uploadAudio(formData);

  if (!audioUrl) {
    return {
      error: "Failed to upload audio",
    };
  }

  const { transcriptionUrl } = await getTranscriptionUrl(audioUrl);

  if (!transcriptionUrl) {
    return {
      error: "Failed to get transcription",
    };
  }

  let status = "queued";
  let result: any;

  let retryCount = 10;

  while (status != "done" && retryCount > 0) {
    retryCount--;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const transcriptionResult = await getTranscription(transcriptionUrl);
    status = transcriptionResult.status;
    result = transcriptionResult.result;
  }

  return { result };
}
