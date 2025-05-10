import * as fs from "fs";
import * as path from "path";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
    ShiftEntity,
    ShiftRequirements,
    ShiftRequirementsRaw,
} from "./shift.entity";
import { ScheduleEntity } from "@src/schedule/schedule.entity";
import { ScheduleShift } from "@src/schedule/schedule.service";
import { NurseEntity } from "@src/nurse/nurse.entity";

@Injectable()
export class ShiftService {
    constructor(
        @InjectRepository(ShiftEntity)
        private readonly shiftRepository: Repository<ShiftEntity>
    ) {}

    async getAllShifts() {
        return this.shiftRepository.find();
    }

    async getShiftsByNurse(nurseId: string) {
        return this.shiftRepository.findBy({ nurse: { id: Number(nurseId) } });
    }

    async getShiftsBySchedule(scheduleId: string) {
        return this.shiftRepository.findBy({
            schedule: { id: Number(scheduleId) },
        });
    }
    async createShifts(
        shiftsRaw: ScheduleShift[],
        schedule: ScheduleEntity
    ): Promise<ShiftEntity[]> {
        const shifts: ShiftEntity[] = [];
        for (const shift of shiftsRaw) {
            for (const nurse of shift.assignedNurses) {
                const newShift = this.shiftRepository.create({
                    dayOfWeek: shift.dayOfWeek,
                    type: shift.shift,
                    nurse: { id: nurse.id } as NurseEntity,
                    schedule: schedule,
                });
                await this.shiftRepository.save(newShift);
                shifts.push(newShift);
            }
        }
        return shifts;
    }
    async getShiftRequirements(): Promise<ShiftRequirements[]> {
        const filePath = path.join(
            process.cwd(),
            "./src/shift/shiftRequirements.json"
        );
        const dayOfWeekMapping = Object.fromEntries(
            [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ].map((day, index) => [day, index])
        );
        const fileContents = fs.readFileSync(filePath, "utf8");
        const shiftRequirements: ShiftRequirementsRaw[] =
            JSON.parse(fileContents)["shiftRequirements"];
        return shiftRequirements.map((shift) => {
            return {
                ...shift,
                dayOfWeek: dayOfWeekMapping[shift.dayOfWeek],
            };
        });
    }
}
