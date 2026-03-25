import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Knowledge } from "../knowledge/knowledge.entity";
import { EmbeddingService } from "../embeddings/embedding.service";
import { MemoryService } from "../memory/memory.service";

@Injectable()
export class RagService {

  private openai = new OpenAI({
    apiKey: "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"
  });

  constructor(
    @InjectRepository(Knowledge)
    private repo: Repository<Knowledge>,
    private embeddingService: EmbeddingService,
    private memoryService: MemoryService
  ) { }

  // async search(question: string) {

  //   const queryEmbedding =
  //     await this.embeddingService.generateEmbeddings(question);

  //   const vector = `[${queryEmbedding.join(",")}]`;

  //   const docs = await this.repo.query(
  //     `
  //   SELECT title, content,
  //   embedding <=> $1::vector AS score
  //   FROM knowledge
  //   ORDER BY score
  //   LIMIT 5
  //   `,
  //     [vector]
  //   );

  //   return docs;
  // }

  async search(question: string) {

    const queryEmbedding =
      (await this.embeddingService.generateEmbeddings(question))[0];

    const vector = `[${queryEmbedding.join(",")}]`;

    const docs = await this.repo.query(
      `
    SELECT title, content,
    embedding <=> $1::vector AS score
    FROM knowledge
    ORDER BY score
    LIMIT 5
    `,
      [vector]
    );

    return docs;
  }

  async ask(question: string) {

    const docs = await this.search(question);
    console.log("Retrieved documents:", docs);
    const context =
      docs.length > 0
        ? docs.map(d => d.content).join("\n")
        : "No relevant documents found.";

    const prompt = `
       You are a helpful assistant.
       Answer the question ONLY using the provided context.

      Context:
        ${context}

      Question:
       ${question}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ]
    });
    console.log("OpenAI response:", response.choices[0].message.content);

    const responseText =
      response.choices[0].message.content ?? "No response generated";

    console.log("OpenAI response:", responseText);

    console.log("Saving memory...");

    await this.memoryService.saveMemory(question, responseText);

    console.log("Memory saved");

    return responseText;
  }

  //   async ask(question: string) {

  //     const docs = await this.search(question);
  //     console.log("Retrieved documents:", docs);

  //     const responses = [];

  //     for (const doc of docs) {

  //       const prompt = `
  // You are a helpful assistant.

  // Answer the question ONLY using the provided context.

  // Context:
  // ${doc.content}

  // Question:
  // ${question}
  // `;

  //       const response = await this.openai.chat.completions.create({
  //         model: "gpt-4o-mini",
  //         messages: [
  //           { role: "user", content: prompt }
  //         ]
  //       });

  //       responses.push({
  //         source: doc.title,
  //         answer: response.choices[0].message.content
  //       });
  //     }

  //     console.log("Responses:", responses);

  //     return responses;
  //   }

}