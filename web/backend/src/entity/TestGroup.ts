//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** TestGroup Entity

import { Column, PrimaryGeneratedColumn, Entity, ManyToMany, OneToMany } from "typeorm"
import { Test } from "./Test";
import { TestResult } from "./TestResult";

@Entity()
export class TestGroup {
    @PrimaryGeneratedColumn()
    testGroupId!: number;

    @Column('text', {nullable: true})
    name!: string;

    @Column('text', {nullable: true})
    schedule!: string | null;

    @ManyToMany(() => Test, test => test.groups)
    tests!: Test[];

    @OneToMany(() => TestResult, (result) => result.testGroup, {
    cascade: true,
    })
    results!: TestResult[];
}
