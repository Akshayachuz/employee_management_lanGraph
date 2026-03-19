import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "./employee.entity";
import { EmployeeService } from "./employee.service";
import { ToolModelGemini } from "src/agents/tools/employee.tools";
import { EmployeeController } from "./employee.controller";
import { ToolModelOpenAI } from "src/agents/tools/employeeOpenAi.tools";

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    providers: [EmployeeService, ToolModelGemini, ToolModelOpenAI],
    controllers: [EmployeeController],
})
export class EmployeeModule { }