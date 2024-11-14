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

    @Column()
    firstAdded!: string;

    @Column()
    lastRun: string | undefined;

    @Column()
    lastUpdated: string | undefined;

    @Column()
    lastFailed: string | undefined;

    @OneToOne(() => Test, test => test.timestamp, {
        cascade: true,
    })
    @JoinColumn()
    test!: Test
}
