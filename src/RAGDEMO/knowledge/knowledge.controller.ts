import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateKnowledgeDto } from "./dto/create.knowledge";
import { KnowledgeService } from "./knowledge.service";

@Controller('knowledge')
export class KnowledgeController {

    constructor(private knowledgeService: KnowledgeService) { }

    @Post()
    create(@Body() dtos: CreateKnowledgeDto[]) {
        console.log("DTOs:", dtos);
        return this.knowledgeService.create(dtos);
    }

    @Get()
    findAll() {
        return this.knowledgeService.findAll();
    }
}