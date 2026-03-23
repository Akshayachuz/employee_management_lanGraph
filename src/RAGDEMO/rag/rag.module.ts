import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Knowledge } from "../knowledge/knowledge.entity";
import { RagService } from "./rag.service";
import { RagController } from "./rag.controller";
import { EmbeddingService } from "../embeddings/embedding.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Knowledge])
  ],
  controllers: [RagController],
  providers: [RagService, EmbeddingService]
})
export class RagModule {}