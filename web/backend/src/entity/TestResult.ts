//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** TestResult Entity

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { TestGroup } from "./TestGroup";

@Entity()
export class TestResult {
    @PrimaryGeneratedColumn()
    resultId!: number;

    @ManyToOne(() => TestGroup, (group) => group.results)
    testGroup!: TestGroup;

    // raw pytest output for logging
    // need to check if string can hold long tests
    @Column('text')
    output!: string;

    @Column('int')
    passedSubtests!: number;

    @Column('int')
    failedSubtests!: number;

    @Column('boolean')
    overallSuccess!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
}
