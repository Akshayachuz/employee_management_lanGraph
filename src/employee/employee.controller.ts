import { ToolModelGemini } from 'src/agents/tools/employee.tools';
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { employeeDto } from "./employee.entity";
import { EmployeeService } from "./employee.service";
import { ToolModelOpenAI } from 'src/agents/tools/employeeOpenAi.tools';

@Controller('employees')
export class EmployeeController {

  constructor(private EmployeeService: EmployeeService, private ToolModelGemini: ToolModelGemini, private ToolModelOpenAI: ToolModelOpenAI

  ) { }

  @Post()
  createEmployee(@Body() employeeDto: employeeDto) {
    console.log("employee dto", employeeDto)
    return this.EmployeeService.createeEmployee(employeeDto);
  }

  @Get('search')
  searchTasks(@Body() q: any) {
    return this.ToolModelOpenAI.createToolModelOpenAI(q);
  }
}