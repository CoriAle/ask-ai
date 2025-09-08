import { NextResponse } from 'next/server';
import OpenAI from "openai";


const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const query = body.query;

    if (typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query: must be a string.' },
        { status: 400 }
      );
    }

    const openaiResponse = await openaiClient.responses.create({
        model: MODEL,
        input: [
            {
                role: "user",
                content: query,
            },
        ],
    });

    return NextResponse.json({ response: openaiResponse.output_text });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse request body.' },
      { status: 400 }
    );
  }
}