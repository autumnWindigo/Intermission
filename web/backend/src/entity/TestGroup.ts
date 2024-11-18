//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** TestGroup Entity

import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from "typeorm"
import { Test } from "./Test";

@Entity()
export class TestGroup {
    @PrimaryGeneratedColumn()
    TestGroupID!: number;

    @Column('text', {nullable: true})
    name!: string;

    @ManyToMany(() => Test, test => test.groups)
    tests!: Test[];

}
