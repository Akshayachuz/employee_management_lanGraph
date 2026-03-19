import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  Id: string;

  @Column()
  Name: string

  @Column()
  Email: string

  @Column({ type: 'varchar', length: 100 })
  TeamName: string

  @Column({ type: 'varchar', length: 100 })
  ProjectName: string

  @Column()
  Designation: string

  @Column()
  TeamLead: string

  @Column()
  TeamManager: string

}

export class employeeDto {
  Id: string;
  name: string;
  Email: string;
  TeamName: string;
  ProjectName: string;
  Designation: string;
  TeamLead: string;
  TeamManager: string;
}