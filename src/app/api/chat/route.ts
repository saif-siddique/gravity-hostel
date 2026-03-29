import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { public_ai_instruction } from '@/data/instructions.json'

export async function POST(request:Request) {
    const { messages }: {messages: UIMessage[]} = await request.json();

    const response = streamText({
        model: google("gemini-2.5-flash-lite"),
        messages: await convertToModelMessages(messages),
        system: public_ai_instruction
    })

    return response.toUIMessageStreamResponse();
}