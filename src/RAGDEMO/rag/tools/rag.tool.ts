// import OpenAI from "openai";

// export class RagToolModel {

//   constructor(
//     private ai: OpenAI,
//     private executor: RagToolExecutor
//   ) {}

//   async createRagToolModel(question: string) {

//     const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
//       {
//         type: "function",
//         function: {
//           name: "searchKnowledge",
//           description: "Search relevant documents from vector database",
//           parameters: {
//             type: "object",
//             properties: {
//               query: {
//                 type: "string",
//                 description: "User question to search knowledge base"
//               }
//             },
//             required: ["query"]
//           }
//         }
//       }
//     ];

//     const response = await this.ai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an AI assistant that answers questions using a knowledge database."
//         },
//         {
//           role: "user",
//           content: question
//         }
//       ],
//       tools
//     });

//     const message = response.choices?.[0]?.message;

//     if (!message) {
//       return { response: "No response from AI" };
//     }

//     // If tool call happens
//     if (message.tool_calls && message.tool_calls.length > 0) {

//       const toolCall = message.tool_calls[0];
//       const toolName = toolCall.function.name;
//       const args = JSON.parse(toolCall.function.arguments || "{}");

//       console.log("Tool Called:", toolName);
//       console.log("Arguments:", args);

//       const toolResult = await this.executor.execute(toolName, args);

//       const finalResponse = await this.ai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "system",
//             content:
//               "Use the provided knowledge to answer the question."
//           },
//           {
//             role: "user",
//             content: question
//           },
//           message,
//           {
//             role: "tool",
//             tool_call_id: toolCall.id,
//             content: JSON.stringify(toolResult)
//           }
//         ]
//       });

//       return {
//         response: finalResponse.choices?.[0]?.message?.content
//       };
//     }

//     return {
//       response: message.content
//     };
//   }
// }