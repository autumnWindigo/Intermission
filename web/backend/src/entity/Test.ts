//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Test Entity

import { Column, PrimaryGeneratedColumn, Entity, OneToOne, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { Report } from "./Report";
import { TestGroup } from "./TestGroup";
import { TestTimestamp } from "./TestTimestamp";

/*
Cascading works differently with typeorm

Basically if it's cascading it joins the objects together
so we can use Test.reports to get the list of reports

pretty much creates pointers to the others and has the
Test object control if they're gc'd or not
*/

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    testId!: number;

    @Column("text")
    fileName!: string;

    @Column("text")
    testName!: string;

    @Column("text", { nullable: true })
    filePath: string | undefined;

    @OneToOne(() => TestTimestamp, (timestamp) => timestamp.test, {
        cascade: true,
    })
    timestamp!: TestTimestamp;

    @ManyToMany(() => TestGroup, (group) => group.tests, {
        cascade: true,
    })
    @JoinTable()
    groups!: TestGroup[];

    @OneToMany(() => Report, (report) => report.test, {
        cascade: true,
    })
    reports!: Report[];
}
