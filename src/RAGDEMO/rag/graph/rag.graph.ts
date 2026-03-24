import { StateGraph, START, END } from "@langchain/langgraph";
import { GraphState } from "../state/rag.state";

export function createRagGraph(toolModel: any, executor: any) {

  const builder = new StateGraph(GraphState);

  // Agent node
  builder.addNode("agent", async (state) => {

    const response = await toolModel.createRagToolModel(state.input);

    return {
      messages: [response.response]
    };
  })

  // Tool node
  .addNode("toolExecutor", async (state) => {

    if (!state.tool) return {};

    const result = await executor.execute(
      state.tool.name,
      state.tool.args
    );

    return {
      toolResult: result
    };
  })

  .addEdge("__start__", "agent")
  .addEdge("agent", "toolExecutor")
  .addEdge("toolExecutor", "__end__");

  return builder.compile();
}