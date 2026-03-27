import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { RagService } from "./rag.service";
import type { Response } from "express";
import { RagToolModel } from "./tools/rag.tool";
import { MemoryService } from "../memory/memory.service";
@Controller('rag')

export class RagController {

    constructor(private ragService: RagService, private memoryService: MemoryService,
    ) { }

    @Post("chat")
    chat(@Body("question") question: string) {
        return this.ragService.askStream(question);
    }

    //final frontend working code
    // @Post("ask")
    // async ask(@Body("question") q: string, @Res() res: Response) {
    //     console.log("Question received:", q);

    //     res.setHeader("Content-Type", "text/event-stream");

    //     for await (const token of this.ragTool.createRagToolModel(q)) {
    //         res.write(token);
    //     }

    //     res.end();
    // }

    //final streaming testing 
    @Post("ask")
    async ask(@Body("question") q: string, @Res() res: Response) {
        console.log("Question received:", q);

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        try {
            for await (const token of this.ragService.askStream(q)) {
                res.write(`data: ${JSON.stringify(token)}\n\n`);
            } 
            res.write(`data: [DONE]\n\n`);
        } catch (err) {
            console.error("Streaming error:", err);
            res.write(`data: [ERROR]\n\n`);
        } finally {
            res.end();
        }
    }

}

