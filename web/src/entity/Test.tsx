//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Test Entity

import { Column, PrimaryGeneratedColumn, Entity, OneToOne, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { Report } from "./Report";
import { TestGroup } from "./TestGroup";
import { TestTimestamp } from "./TestTimestamp";

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    testId!: number;

    @Column()
    fileName!: string;

    @Column()
    testName!: string;

    @Column()
    filePath: string | undefined;

    @OneToOne(() => TestTimestamp, timestamp => timestamp.test, {
        cascade: true,
    })
    timestamp!: TestTimestamp;

    @ManyToMany(() => TestGroup, group => group.tests, {
        cascade: true,
    })
    @JoinTable()
    groups!: TestGroup[];

    @OneToMany(()=> Report, report => report.test, {
        cascade: true,
    })
    @JoinTable()
    reports!: Report[];
}
