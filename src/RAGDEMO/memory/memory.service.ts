import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Memory } from "./memory.entity";

@Injectable()
export class MemoryService {

  constructor(
    @InjectRepository(Memory)
    private repo: Repository<Memory>
  ) {}

  async saveMemory(input: string, response: string) {

    console.log("Saving to DB:", input, response);

    const memory = this.repo.create({
      input,
      response
    });

    return this.repo.save(memory);
  }

}