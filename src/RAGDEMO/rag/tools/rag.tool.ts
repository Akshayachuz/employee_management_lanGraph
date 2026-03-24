// import OpenAI from "openai";
// import { Injectable } from "@nestjs/common";
// import { RagToolExecutor } from "../executors/rag.executor";
// import { SYSTEM_PROMPT } from "src/prompt/employeePrompt";

// @Injectable()
// export class RagToolModel {

//     private ai: OpenAI;

//     constructor(private executor: RagToolExecutor) {

//         this.ai = new OpenAI({
//             apiKey: process.env.OPENAI_API_KEY
//         });
//     }

//     async createRagToolModel(question: string): Promise<any> {

//         const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
//             {
//                 type: "function",
//                 function: {
//                     name: "searchKnowledge",
//                     description: "Search relevant documents from the vector knowledge base",
//                     parameters: {
//                         type: "object",
//                         properties: {
//                             query: {
//                                 type: "string",
//                                 description: "User question used to retrieve relevant documents"
//                             }
//                         },
//                         required: ["query"]
//                     }
//                 }
//             }
//         ];

//         // STEP 1 → Send question to LLM
//         const response = await this.ai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [
//                 {
//                     role: "system",
//                     content: SYSTEM_PROMPT
//                 },
//                 {
//                     role: "user",
//                     content: question
//                 }
//             ],
//             tools
//         });

//         const message = response.choices?.[0]?.message;

//         if (!message) {
//             return { response: "No response from AI" };
//         }

//         // STEP 2 → Check if tool call happens
//         if (message.tool_calls && message.tool_calls.length > 0) {

//             const toolCall = message.tool_calls[0];

//             if (toolCall.type !== "function") {
//                 return { response: "Unsupported tool type" };
//             }

//             const toolName = toolCall.function.name;
//             const args = JSON.parse(toolCall.function.arguments || "{}");

//             console.log("Tool Called:", toolName);
//             console.log("Arguments:", args);

//             // STEP 3 → Execute tool (vector search)
//             const toolResult = await this.executor.execute(toolName, args);

//             // STEP 4 → Send tool result back to LLM
//             const finalResponse = await this.ai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content: SYSTEM_PROMPT
//                     },
//                     {
//                         role: "user",
//                         content: question
//                     },
//                     message,
//                     {
//                         role: "tool",
//                         tool_call_id: toolCall.id,
//                         content: JSON.stringify(toolResult)
//                     }
//                 ]
//             });

//             return {
//                 response: finalResponse.choices?.[0]?.message?.content ?? "No response generated"
//             };
//         }

//         // If LLM answers directly
//         return {
//             response: message.content ?? "No response generated"
//         };
//     }
// }

import OpenAI from "openai";
import { Injectable } from "@nestjs/common";
import { RagToolExecutor } from "../executors/rag.executor";
import { RAG_SYSTEM_PROMPT } from "../prompt/rag.systemprompt";

@Injectable()
export class RagToolModel {

    private ai: OpenAI;

    constructor(private executor: RagToolExecutor) {
        this.ai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async *createRagToolModel(question: string) {
        const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
            {
                type: "function",
                function: {
                    name: "searchKnowledge",
                    description: "Search relevant documents from the vector knowledge base",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "User question used to retrieve relevant documents"
                            }
                        },
                        required: ["query"]
                    }
                }
            }
        ];

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: RAG_SYSTEM_PROMPT
            },
            {
                role: "user",
                content: question
            }
        ];

        // STEP 1 → Send question to LLM
        const response = await this.ai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            tools
        });

        const message = response.choices?.[0]?.message;

        if (!message) {
            yield "No response from AI";
            return;
        }

        // STEP 2 → Tool call check
        if (message.tool_calls && message.tool_calls.length > 0) {

            const toolCall = message.tool_calls[0];

            if (toolCall.type !== "function") {
                yield "Unsupported tool type";
                return;
            }

            const toolName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments || "{}");

            console.log("Tool Called:", toolName);
            console.log("Arguments:", args);

            // STEP 3 → Execute tool (vector search)
            const toolResult = await this.executor.execute(toolName, args);

            messages.push(message);

            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(toolResult)
            });

            // STEP 4 → Streaming response
            const stream = await this.ai.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
                stream: true
            });

            for await (const chunk of stream) {

                const token = chunk.choices?.[0]?.delta?.content;

                if (token) {
                    yield token;
                }
            }

            return;
        }

        // If LLM answers directly
        if (message.content) {
            yield message.content;
        }
    }
}