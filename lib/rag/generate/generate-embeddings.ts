"use server";

import { OpenAI } from "openai";

const openai = new OpenAI();

// Takes an array of text strings and returns their vector embeddings
export async function generateEmbeddings(texts: string[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", // Consider testing other models for performance
    dimensions: 256, // Consider testing higher dimensions for performance (note: will need to change schema)
    input: texts
  });

  // Extract just the embedding vectors from the response
  return response.data.map((item) => item.embedding);
}
