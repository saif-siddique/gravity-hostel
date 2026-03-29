import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  tool,
} from "ai";
import { google } from "@ai-sdk/google";
import { student_ai_instructions } from "@/data/instructions.json";
import z from "zod";
import { executionHandler } from "@/lib/execution-handler";

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const result = streamText({
    model: google( model || "gemini-3-flash-preview"),
    messages: await convertToModelMessages(messages),
    system:`
        You are a hostel assistant.
        If you call a tool and receive data,
        you MUST explain the result to the user in plain text.
        Never stop after a tool call.
        If you are asked to give data then query based on the given Id in prompt.
        `,
    stopWhen: stepCountIs(15),
    tools: {
      getWeather: tool({
        description: "Get the weather in the location",
        inputSchema: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: ({ location }) => {
          return { temperature: 72, conditions: "sunny", location: location };
        },
      }),
      getInformation: tool({
        description: "Get information related to student 'room', 'complaint', 'fee', 'notification' and student own information",
        inputSchema: z.object({
          id: z.string().describe("Id of student to get the data of room."),
          qfor: z
            .enum(['room', 'notification', 'complaint', 'fee', 'attendance', 'user'])
            .describe(`
              pass 'user' when you are asked for actuall user data,
              pass 'room' if student question is related to room data,
              pass 'notification' if asked for notification related information,
              pass 'complaint' if asked for complaint related information,
              pass 'fee' if need fee related information,
              pass 'attendance' if need attendance related data
              `,
            ),
        }),
        execute: async ({ id, qfor }) => await executionHandler({ id, qfor }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
