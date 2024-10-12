import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  const formData = await req.formData();

  const audio = formData.get("audio");

  if (!audio) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "No audio file provided",
      })
    );
  }

  const file = new File([audio as Blob], "audio.mp3", {
    type: "audio/mp3",
  });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "en",
  });

  if (!transcription?.text) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to transcribe audio",
      })
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      text: transcription.text,
    })
  );
}
