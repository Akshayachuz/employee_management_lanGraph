import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Employee, employeeDto } from "./employee.entity";

@Injectable()
export class EmployeeService {

  constructor(
    @InjectRepository(Employee)
    private empRepository: Repository<Employee>,
  ) { }


  async createeEmployee(employeeDto: employeeDto): Promise<Employee> {
    const enployee = this.empRepository.create(employeeDto);
    return await this.empRepository.save(enployee);
  }

  async searchemployee(search: string) {
    return this.empRepository.find({
      where: [
        { Name: ILike(`%${search}%`) },
        { Email: ILike(`%${search}%`) },
        { TeamName: ILike(`%${search}%`) },
        { Designation: ILike(`%${search}%`) },
        { ProjectName: ILike(`%${search}%`) },
        { TeamLead: ILike(`%${search}%`) },
        { TeamManager: ILike(`%${search}%`) }
      ]
    });
  }

  async searchSingleEmployee(search: string) {
    return this.empRepository.findOne({
      where: [
        { Name: ILike(`%${search}%`) },
        { Email: ILike(`%${search}%`) },
        { TeamName: ILike(`%${search}%`) },
        { Designation: ILike(`%${search}%`) },
        { ProjectName: ILike(`%${search}%`) },
        { TeamLead: ILike(`%${search}%`) },
        { TeamManager: ILike(`%${search}%`) }
      ]
    })
  }

  async getUserByField(field: string, value: string) {
    return this.empRepository.findOneBy({
      [field]: value
    } as any);
  }

  async getUserByName(Name: string) {
    return this.empRepository.find({
      where: { Name: Name }
    });
  }

  async getUserByEmail(Email: string) {
    return this.empRepository.find({
      where:{Email: Email}
    })
  }

  async getUserByTeamName(TeamName: string) {
    return this.empRepository.find({
      where: { TeamName: TeamName }
    });
  }

  async getUserByProjectName(ProjectName: string) {
    return this.empRepository.find({
      where: { ProjectName: ProjectName }
    });
  }

  async getUserByDesignation(Designation: string) {
    return this.empRepository.find({
      where: { Designation: Designation }
    });
  }

  async getUserByTeamLead(TeamLead: string) {
    return this.empRepository.find({
      where: { TeamLead: TeamLead }
    });
  }

  async getUserByTeamManager(TeamManager: string) {
    return this.empRepository.find({
      where: { TeamManager: TeamManager }
    });
  }

}