import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert,
} from "typeorm";

import { ShiftEntity } from "@shift/shift.entity";
import { DefaultShiftPreference, ShiftPreference } from "@m7-scheduler/dtos";

@Entity("nurses")
export class NurseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column("json", {
        nullable: true,
    })
    preferences: ShiftPreference[];

    @OneToMany(() => ShiftEntity, (shift) => shift.nurse)
    shifts: ShiftEntity[];

    @BeforeInsert()
    setDefaultPreferences() {
        if (!this.preferences) {
            this.preferences = Array(7).fill(DefaultShiftPreference());
        }
    }
}
