import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { RagService } from "./rag.service";
import type { Response } from "express";
import { RagToolModel } from "./tools/rag.tool";
@Controller('rag')

export class RagController {

    constructor(private ragService: RagService, private ragTool: RagToolModel) { }

    @Post("chat")
    chat(@Body("question") question: string) {
        return this.ragService.ask(question);
    }

    @Post("ask")
    getAnswer(@Body("question") question: string) {
        console.log("Question received:", question);
        return this.ragService.ask(question);
    }

    @Post("ask")
    async ask(@Query("q") q: string, @Res() res: Response) {
        res.setHeader("Content-Type", "text/event-stream");
        for await (const token of this.ragTool.createRagToolModel(q)) {
            res.write(token);
        }
        res.end();
    }

}
