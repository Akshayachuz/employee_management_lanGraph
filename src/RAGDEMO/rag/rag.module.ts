import { Memory } from './../memory/memory.entity';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Knowledge } from "../knowledge/knowledge.entity";
import { RagService } from "./rag.service";
import { RagController } from "./rag.controller";
import { EmbeddingService } from "../embeddings/embedding.service";
import { RagToolExecutor } from "./executors/rag.executor";
import { RagToolModel } from "./tools/rag.tool";
import { MemoryService } from '../memory/memory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Knowledge, Memory])
  ],
  controllers: [RagController],
  providers: [RagService, EmbeddingService, RagToolExecutor, RagToolModel, MemoryService],
})
export class RagModule {}