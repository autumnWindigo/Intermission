//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** TestTimestamp Entity

import { Column, PrimaryGeneratedColumn, Entity, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Test } from "./Test"

@Entity()
export class TestTimestamp {
    @PrimaryGeneratedColumn()
    testTimestampID!: number;

    @CreateDateColumn()
    firstAdded!: Date;

    @Column("text", { nullable: true })
    lastRun!: string | null;

    @OneToOne(() => Test, test => test.timestamp)
    @JoinColumn()
    test!: Test
}
