import { Body, Controller, Get, Post } from "@nestjs/common";
import { RagService } from "./rag.service";

@Controller('rag')

export class RagController {

    constructor(private ragService: RagService) { }

    @Post("chat")
    chat(@Body("question") question: string) {
        return this.ragService.ask(question);
    }

    @Post("ask")
    getAnswer(@Body("question") question: string) {
        console.log("Question received:", question);
        return this.ragService.ask(question);
    }
}
