import { FunctionDeclaration, GoogleGenAI, Type } from "@google/genai";
import { Injectable } from "@nestjs/common";
import { EmployeeService } from "src/employee/employee.service";
import { SYSTEM_PROMPT } from "src/prompt/employeePrompt";
import { EmployeeToolExecutor } from "../excecutors/toolExecutors";

@Injectable()
export class ToolModelGemini {

    private ai: GoogleGenAI;
    private executor: EmployeeToolExecutor;

    constructor(private employeeService: EmployeeService) {
        this.ai = new GoogleGenAI({
            apiKey: "AIzaSyAqRkqFzRd6A1Io0NVrwZESEv9D4WFBLRc"
        });

        this.executor = new EmployeeToolExecutor(employeeService);
    }

    async createToolModelGemini(params: any): Promise<any> {

        const tools: FunctionDeclaration[] = [
            {
                name: "searchemployee",
                description: "Get data from user details based on various fields.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        designation: { type: Type.STRING },
                        email: { type: Type.STRING },
                        teamName: { type: Type.STRING },
                        projectName: { type: Type.STRING },
                        teamLead: { type: Type.STRING },
                        teamManager: { type: Type.STRING }
                    }
                }
            },
            {
                name: "getUserByName",
                description: "Get user details based on name.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        Name: { type: Type.STRING }
                    }
                }
            },
            {
                name: "getUserByEmail",
                description: "Get user details based on Email.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        Email: { type: Type.STRING }
                    }
                }
            },
            {
                name: "getUserByTeamName",
                description: "Get user details based on team name.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        TeamName: { type: Type.STRING }
                    }
                }
            },
            {
                name: "getUserByDesignation",
                description: "Get user details based on designation.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        Designation: { type: Type.STRING }
                    }
                }
            },
            {
                name: "getUserByProjectName",
                description: "Get user details based on project name.",
                parameters: {
                    type: Type.OBJECT,
                    properties: { ProjectName: { type: Type.STRING } }
                }
            },
            {
                name: "getUserByTeamLead",
                description: "Get user details based on team lead.",
                parameters: {
                    type: Type.OBJECT,
                    properties: { TeamLead: { type: Type.STRING } }
                }
            },
            {
                name: "getUserByTeamManager",
                description: "Get user details based on team manager.",
                parameters: {
                    type: Type.OBJECT,
                    properties: { TeamManager: { type: Type.STRING } }
                }
            }
        ];

        // STEP 1 → Ask Gemini
        const response = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    parts: [{ text: params.name }]
                }
            ],
            config: {
                systemInstruction: SYSTEM_PROMPT,
                tools: [
                    {
                        functionDeclarations: tools
                    }
                ]
            }
        });

        const candidate = response.candidates?.[0];
        const part = candidate?.content?.parts?.find(p => p.functionCall);

        // STEP 2 → If Gemini calls a tool
        if (part?.functionCall) {

            const toolName = part.functionCall.name;
            const args = part.functionCall.args;

            console.log("Tool:", toolName);
            console.log("Args:", args);

            // Execute tool
            const toolResult = await this.executor.execute(toolName!, args);

            // STEP 3 → Send DB result back to Gemini
            const finalResponse = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        parts: [{
                            text: `User question: ${params.name}. Database result: ${JSON.stringify(toolResult)}`
                        }]
                    }
                ],
                config: {
                    systemInstruction: SYSTEM_PROMPT
                }
            });

            return {
                response: finalResponse.candidates?.[0]?.content?.parts?.[0]?.text
            };
        }

        // If no tool called
        return {
            response: response.candidates?.[0]?.content?.parts?.[0]?.text
        };
    }
}