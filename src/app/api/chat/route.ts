import { NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "../../../lib/openai";

const chatInputSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { messages } = chatInputSchema.parse(json);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
  }
}
