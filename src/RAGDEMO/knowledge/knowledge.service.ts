import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Knowledge } from "./knowledge.entity";
import { EmbeddingService } from "../embeddings/embedding.service";
import { CreateKnowledgeDto } from "./dto/create.knowledge";

@Injectable()
export class KnowledgeService {

    constructor(
        @InjectRepository(Knowledge)
        private repo: Repository<Knowledge>,
        private embeddingService: EmbeddingService
    ) { }

    // ✅ CHUNK METHOD
    private chunkText(text: string, size: number = 200): string[] {
        const chunks: string[] = [];

        for (let i = 0; i < text.length; i += size) {
            chunks.push(text.substring(i, i + size));
        }

        return chunks;
    }

    //⭐ following is a demo code which has beed added overlap logic to the chunking method, but it is not being used in the controller, so it is commented out. You can use it if you want to have overlapping chunks, which can help with context retention in some cases.
    // private chunkText(text: string, size: number = 450, overlap: number = 80): string[] {

    //     const chunks: string[] = [];
    //     let start = 0;

    //     while (start < text.length) {

    //         const end = start + size;
    //         chunks.push(text.slice(start, end));

    //         start += size - overlap;
    //     }

    //     return chunks;
    // }

    // ✅ BULK CREATE METHOD
    async create(data: CreateKnowledgeDto | CreateKnowledgeDto[]) {

        const dtos = Array.isArray(data) ? data : [data];
        const results: Knowledge[] = [];

        for (const dto of dtos) {

            const textChunks = this.chunkText(dto.content, 200);

            const embeddings =
                await this.embeddingService.generateEmbeddings(textChunks);

            const records = textChunks.map((chunk, i) => ({
                title: dto.title,
                content: chunk,
                embedding: embeddings[i]
            }));

            const saved = await this.repo.save(records);

            results.push(...saved);
        }

        return results;
    }

    async findAll() {
        return this.repo.find();
    }
}