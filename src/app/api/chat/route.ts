import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const bots = [
  // Add your bots here
] as Array<{
  name: string;
  description: string;
}>;

const model = google("gemini-1.5-flash-latest");

export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: Array<{
      text: string;
      role: "bot" | "user";
      botName?: string;
    }>;
  } = await req.json();

  const { object } = await generateObject({
    model,
    schema: z.object({
      messages: z
        .array(
          z.object({
            botName: z.string().describe("Which bot should respond?"),
            text: z.string().describe("The message to respond to."),
          })
        )
        .describe("The messages to respond to."),
    }),
    prompt: `
  Current conversation:
${messages
  .map(
    (message) =>
      `${message.role === "user" ? "User" : message.botName}: ${message.text}`
  )
  .join("\n")}

Based on this conversation, generate the next appropriate response(s) following the system guidelines.

    `,
    system: `
System Guidelines:
You have to generate responses for the ongoing conversation. The conversation should be natural and engaging. If required you can generate multiple responses. The responses should be generated based on the conversation context and maintain a natural flow. 

Note:
1. If user is saying Hi, then if the bots are relational with each other then one bot from the same realtion should respond and introduce other as well.

2. If user is asking about the bot then the bot should introduce itself.


Available bots:
${bots.map((bot) => `${bot.name}: ${bot.description}`).join("\n")}

Generate responses that follow these guidelines and maintain a natural conversation flow.
    `,
  });

  return new Response(
    JSON.stringify({
      messages: object.messages,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
