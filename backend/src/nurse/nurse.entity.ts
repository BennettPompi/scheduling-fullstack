import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { ShiftEntity } from "../shift/shift.entity";

export type ShiftPreference = {
    dayShift: boolean;
    nightShift: boolean;
};
@Entity("nurses")
export class NurseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column("json", {
        nullable: false,
        default: Array(7).fill({ dayShift: false, nightShift: false }),
    })
    preferences: ShiftPreference[];

    @OneToMany(() => ShiftEntity, (shift) => shift.nurse)
    shifts: ShiftEntity[];
}
