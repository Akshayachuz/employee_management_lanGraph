import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Knowledge {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column({
    type: "vector",
    length: 1536
  })
  embedding: number[];
}