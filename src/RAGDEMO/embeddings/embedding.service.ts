import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { text } from "stream/consumers";

@Injectable()
export class EmbeddingService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  async generateEmbeddings(texts: string | string[]): Promise<number[][]> {
    console.log("Embedding input:", text);

    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts
    });

    return response.data.map(item => item.embedding);
  }
}