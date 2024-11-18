//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** TestTimestamp Entity

import { Column, PrimaryGeneratedColumn, Entity, OneToOne, JoinColumn } from "typeorm"
import { Test } from "./Test"

@Entity()
export class TestTimestamp {
    @PrimaryGeneratedColumn()
    testTimestampID!: number;

    @Column("text")
    firstAdded!: string;

    @Column("text", { nullable: true })
    lastRun: string | undefined;

    @Column("text", { nullable: true })
    lastUpdated: string | undefined;

    @Column("text", { nullable: true})
    lastFailed: string | undefined;

    @OneToOne(() => Test, test => test.timestamp)
    @JoinColumn()
    test!: Test
}
