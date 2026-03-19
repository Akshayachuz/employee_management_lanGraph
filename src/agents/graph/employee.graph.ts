import { StateGraph, START, END } from "@langchain/langgraph";
import { ToolModelGemini } from "../tools/employee.tools";
import { EmployeeService } from "src/employee/employee.service";
import { state } from "../state/agent.state";
import { EmployeeToolExecutor } from '../excecutors/toolExecutors';

export function createEmployeeGraph(
  toolModel: ToolModelGemini,
  employeeService: EmployeeService
) {

  const executor = new EmployeeToolExecutor(employeeService);

  const builder = new StateGraph(state);

  // Agent node
  builder.addNode("agent", async (state) => {

    const response = await toolModel.createToolModelGemini(state.input);

    const toolCall =
      response?.candidates?.[0]?.content?.parts?.[0]?.functionCall;

    if (!toolCall) {
      return {
        messages: [response.text]
      };
    }

    return {
      tool: toolCall
    };
  })

  // Tool execution node
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
  .addEdge("toolExecutor", END);

  return builder.compile();
}