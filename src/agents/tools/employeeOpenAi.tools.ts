import OpenAI from "openai";
import { Injectable } from "@nestjs/common";
import{ EmployeeService } from "src/employee/employee.service";
import { SYSTEM_PROMPT } from "src/prompt/employeePrompt";
import { EmployeeToolExecutor } from "../excecutors/toolExecutors";

@Injectable()
export class ToolModelOpenAI {

    private ai: OpenAI;
    private executor: EmployeeToolExecutor;

    constructor(private employeeService: EmployeeService) {

        this.ai = new OpenAI({
            apiKey: "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"
        });

        this.executor = new EmployeeToolExecutor(employeeService);
    }

    async createToolModelOpenAI(params: any): Promise<any> {

        const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
            {
                type: "function",
                function: {
                    name: "searchemployee",
                    description: "Get employee data using multiple filters",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            designation: { type: "string" },
                            email: { type: "string" },
                            teamName: { type: "string" },
                            projectName: { type: "string" },
                            teamLead: { type: "string" },
                            teamManager: { type: "string" }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getUserByName",
                    description: "Get employee by name",
                    parameters: {
                        type: "object",
                        properties: {
                            Name: { type: "string" }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getUserByEmail",
                    description: "Get employee by email",
                    parameters: {
                        type: "object",
                        properties: {
                            Email: { type: "string" }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getUserByTeamName",
                    description: "Get employee by team name",
                    parameters: {
                        type: "object",
                        properties: {
                            TeamName: { type: "string" }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getUserByDesignation",
                    description: "Get employee by designation",
                    parameters: {
                        type: "object",
                        properties: {
                            Designation: { type: "string" }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getUserByProjectName",
                    description: "Get employee by project",
                    parameters: {
                        type: "object",
                        properties: {
                            ProjectName: { type: "string" }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getUserByTeamLead",
                    description: "Get employee by team lead",
                    parameters: {
                        type: "object",
                        properties: {
                            TeamLead: { type: "string" }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getUserByTeamManager",
                    description: "Get employee by team manager",
                    parameters: {
                        type: "object",
                        properties: {
                            TeamManager: { type: "string" }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "searchEmployees",
                    description: "Search employees and return requested fields",
                    parameters: {
                        type: "object",
                        properties: {
                            field: {
                                type: "string",
                                description: "Column to return: name, projectName, teamName, teamLead, teamManager, designation"
                            },
                            name: { type: "string" },
                            projectName: { type: "string" },
                            teamName: { type: "string" },
                            teamLead: { type: "string" },
                            teamManager: { type: "string" },
                            designation: { type: "string" }
                        }
                    }
                }
            }
        ];

        // STEP 1 → Send user query to OpenAI
        const response = await this.ai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: params.name
                }
            ],
            tools
        });

        const message = response.choices?.[0]?.message;

        if (!message) {
            return { response: "No response from AI" };
        }

        // STEP 2 → If AI decides to call a tool
        if (message.tool_calls && message.tool_calls.length > 0) {

            const toolCall = message.tool_calls[0];

            if (toolCall.type !== "function") {
                return { response: "Unsupported tool type" };
            }

            const toolName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments || "{}");

            console.log("Tool Called:", toolName);
            console.log("Arguments:", args);

            // Execute tool
            const toolResult = await this.executor.execute(toolName, args);

            // STEP 3 → Send DB result back to OpenAI
            const finalResponse = await this.ai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: params.name
                    },
                    message,
                    {
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(toolResult)
                    }
                ]
            });

            return {
                response: finalResponse.choices?.[0]?.message?.content ?? "No response generated"
            };
        }

        // If AI answers directly
        return {
            response: message.content ?? "No response generated"
        };
    }
}