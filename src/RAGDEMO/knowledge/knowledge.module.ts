import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Knowledge } from "./knowledge.entity";
import { KnowledgeService } from "./knowledge.service";
import { KnowledgeController } from "./knowledge.controller";
import { EmbeddingService } from "../embeddings/embedding.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Knowledge])
  ],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, EmbeddingService],
  exports: [KnowledgeService]
})
export class KnowledgeModule {}