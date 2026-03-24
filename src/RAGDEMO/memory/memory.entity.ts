import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Memory {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  input: string;

  @Column("text")
  response: string;

  @CreateDateColumn()
  time: Date;
}