import { Column, PrimaryGeneratedColumn, Entity } from "typeorm"

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileName: string

}
