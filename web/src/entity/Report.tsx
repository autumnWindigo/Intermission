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

    @Column()
    pass!: boolean;

    @Column()
    timestamp!: string;

    @ManyToOne(() => Test, test => test.reports)
    test!: Test;
}
