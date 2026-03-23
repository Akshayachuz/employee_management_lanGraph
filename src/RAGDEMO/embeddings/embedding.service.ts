import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class EmbeddingService {

  private openai = new OpenAI({
    apiKey: "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"
  });

  async generateEmbeddings(texts: string[]): Promise<number[][]> {

    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts
    });

    return response.data.map(item => item.embedding);
  }
}