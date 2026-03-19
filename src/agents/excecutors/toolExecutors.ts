import { EmployeeService } from "src/employee/employee.service";

export class EmployeeToolExecutor {

  constructor(private employeeService: EmployeeService) {}

  async execute(toolName: string, args: any) {

    switch (toolName) {

      case "searchemployee":
        return this. employeeService.searchemployee(args.name)

      case "getUserByName":
        return this.employeeService.getUserByName(args.name ?? args.Name);

      case "getUserByEmail":
        return this.employeeService.getUserByEmail(args.email ?? args.Email);

      case "getUserByTeamName":
        return this.employeeService.getUserByTeamName(args.TeamName);

      case "getUserByDesignation":
        return this.employeeService.getUserByDesignation(args.Designation);

      case "getUserByProjectName":
        return this.employeeService.getUserByProjectName(args.ProjectName);

      case "getUserByTeamLead":
        console.log(this.employeeService.getUserByTeamLead(args.TeamLead))
        return this.employeeService.getUserByTeamLead(args.TeamLead);

      case "getUserByTeamManager":
        return this.employeeService.getUserByTeamManager(args.TeamManager);

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}