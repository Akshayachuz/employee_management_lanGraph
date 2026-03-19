// import { MessagesValue, StateSchema } from "@langchain/langgraph";

// export const AgentState = new StateSchema({
//   messages: MessagesValue
// });
import { Annotation } from "@langchain/langgraph";

export const state = Annotation.Root({
  input: Annotation<string>(),
  userId: Annotation<string>(),
  tool: Annotation<any>(),
  toolResult: Annotation<any>(),
  messages: Annotation<any[]>(),
});