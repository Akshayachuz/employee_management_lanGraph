import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Knowledge } from "../knowledge/knowledge.entity";
import { EmbeddingService } from "../embeddings/embedding.service";
import { MemoryService } from "../memory/memory.service";
import { RagToolModel } from "./tools/rag.tool";

@Injectable()
export class RagService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  constructor(
    @InjectRepository(Knowledge)
    private repo: Repository<Knowledge>,
    private embeddingService: EmbeddingService,
    private memoryService: MemoryService,
  ) { }

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

  // async ask(question: string) {

  //   const docs = await this.search(question);
  //   console.log("Retrieved documents:", docs);
  //   const context =
  //     docs.length > 0
  //       ? docs.map(d => d.content).join("\n")
  //       : "No relevant documents found.";

  //   const prompt = `
  //      You are a helpful assistant.
  //      Answer the question ONLY using the provided context.

  //     Context:
  //       ${context}

  //     Question:
  //      ${question}`;

  //   const response = await this.openai.chat.completions.create({
  //     model: "gpt-4o-mini",
  //     messages: [
  //       { role: "user", content: prompt }
  //     ]
  //   });
  //   console.log("OpenAI response1:", response.choices[0].message.content);

  //   const responseText =
  //     response.choices[0].message.content ?? "No response generated";

  //   console.log("OpenAI response2:", responseText);

  //   console.log("Saving memory...");

  //   await this.memoryService.saveMemory(question, responseText);

  //   console.log("Memory saved");

  //   return responseText;
  // }


  //following func added for streaming testing
  async *askStream(question: string): AsyncGenerator<string> {
    const docs = await this.search(question);
    console.log("Retrieved documents:", docs);

    const context = docs.length > 0
      ? docs.map(d => d.content).join("\n")
      : "No relevant documents found.";

    const prompt = `
      You are a helpful assistant.
      Answer the question ONLY using the provided context.

      Context:
        ${context}

      Question:
       ${question}`;

    const stream = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true, // ✅ enable streaming
      messages: [{ role: "user", content: prompt }]
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? "";
      if (token) {
        fullResponse += token;
        yield token; // ✅ push token to caller immediately
      }
    }

    // ✅ Save memory only after full response is accumulated
    console.log("Saving memory...");
    await this.memoryService.saveMemory(question, fullResponse);
    console.log("Memory saved");
  }

}