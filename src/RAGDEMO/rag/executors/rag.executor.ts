import { RagService } from "../rag.service";

export class RagToolExecutor {

  constructor(private ragService: RagService) {}

  async execute(toolName: string, args: any) {

    switch (toolName) {

      case "searchKnowledge":
        return await this.ragService.search(args.query);

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}