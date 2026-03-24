import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
    input: Annotation<string>(),
    tool: Annotation<any>(),
    toolResult: Annotation<any>(),
    messages: Annotation<string[]>()
});