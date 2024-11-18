//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Report Entity

import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm"
import { Test } from "./Test";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    resultId!: number;

    @Column("boolean")
    pass!: boolean;

    @Column("text")
    timestamp!: string;

    @ManyToOne(() => Test, test => test.reports)
    test!: Test;
}
