import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { NurseEntity } from "../nurse/nurse.entity";
import { ScheduleEntity } from "../schedule/schedule.entity";

export type ShiftType = "day" | "night";
export type ShiftRequirementsRaw = {
    shift: ShiftType;
    nursesRequired: number;
    dayOfWeek: string;
};

@Entity("shifts")
export class ShiftEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    dayOfWeek: number;

    @Column({ type: "varchar", length: 10 })
    type: ShiftType;

    @ManyToOne(() => NurseEntity, (nurse) => nurse.shifts)
    nurse: NurseEntity;

    @ManyToOne(() => ScheduleEntity, (schedule) => schedule.shifts)
    schedule: ScheduleEntity;
}
