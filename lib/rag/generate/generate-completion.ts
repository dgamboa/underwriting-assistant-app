"use server";

import { OpenAI } from "openai";

const openai = new OpenAI();

export async function generateCompletionWithContext(context: string, input: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Consider testing other models for performance
    temperature: 0,
    max_tokens: 1000,
    messages: [
      { role: "system", content: `Answer based on the provided context. Context: ${context}` }, // Consider making this more sophisticated
      { role: "user", content: input }
    ],
  });

  return completion.choices[0].message.content;
}
