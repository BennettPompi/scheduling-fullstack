import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ScheduleEntity } from "./schedule.entity";
import { ShiftService } from "@src/shift/shift.service";
import { NurseService } from "@src/nurse/nurse.service";
import { ShiftRequirements } from "@m7-scheduler/dtos";
import { ShiftPreference } from "@m7-scheduler/dtos";
import { NurseEntity } from "@src/nurse/nurse.entity";

type SimpleNurse = {
    id: number;
    preferences: ShiftPreference[];
    assignedCount: number;
};
export type ScheduleShift = ShiftRequirements & {
    assignedNurses: SimpleNurse[];
    availableNurses: SimpleNurse[];
};
@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(ScheduleEntity)
        private readonly scheduleRepository: Repository<ScheduleEntity>,
        private readonly shiftService: ShiftService,
        private readonly nurseService: NurseService
    ) {}

    async generateSchedule(): Promise<ScheduleEntity> {
        /* 
            1. Go through nurses/prefs, create list of nurses available for each shift
            2. Maintain count of nurses assigned to each shift, sort each shift pool by count (asc)
            3. For each shift, assign nurses from ordered pool until all shifts are filled
                a. Check that the nurse is not assigned to the previous shift.
                If they are, exclude them unless we need them
                If they were assigned to the previous 2 shifts, exclude them no matter what
            FINALLY: Iterate through shift assignments, create shift objects for each of them
        */
        const schedule: ScheduleShift[] = (
            await this.shiftService.getShiftRequirements()
        ).map((shift) => {
            return {
                ...shift,
                assignedNurses: [],
                availableNurses: [],
            };
        });
        const nurses: SimpleNurse[] = (await this.nurseService.getNurses()).map(
            (nurse) => {
                return {
                    id: nurse.id,
                    preferences: nurse.preferences,
                    assignedCount: 0,
                };
            }
        );

        for (const nurse of nurses) {
            const preferences = nurse.preferences;
            for (let i = 0; i < preferences.length; i += 1) {
                const dayPref = preferences[i];
                if (dayPref.dayShift == true)
                    schedule[2 * i].availableNurses.push(nurse);
                if (dayPref.nightShift == true)
                    schedule[2 * i + 1].availableNurses.push(nurse);
            }
        }
        for (let i = 0; i < schedule.length; i++) {
            const shift = schedule[i];
            const available = shift.availableNurses;
            //prioritize nurses with fewest assignments
            available.sort(
                (nurseA, nurseB) => nurseA.assignedCount - nurseB.assignedCount
            );

            const wouldBeDouble = [];
            for (const nurse of available) {
                if (shift.assignedNurses.length == shift.nursesRequired) break;

                if (i > 0 && schedule[i - 1].assignedNurses.includes(nurse)) {
                    // if this would be a triple shift for the nurse, we don't want to assign them at all as I assume this is illegal
                    if (i > 1 && schedule[i - 2].assignedNurses.includes(nurse))
                        continue;
                    // if only a double, put them into reserve pool in case we need more later.
                    wouldBeDouble.push(nurse);
                    continue;
                }
                shift.assignedNurses.push(nurse);
                nurse.assignedCount++;
            }
            // if we need more, pull double shift nurses until we have enough or run out
            if (shift.assignedNurses.length < shift.nursesRequired) {
                for (const nurse of wouldBeDouble) {
                    if (shift.assignedNurses.length == shift.nursesRequired)
                        break;
                    shift.assignedNurses.push(nurse);
                    nurse.assignedCount++;
                }
            }
        }
        const dbSchedule = new ScheduleEntity();
        await this.scheduleRepository.save(dbSchedule);
        dbSchedule.shifts = await this.shiftService.createShifts(
            schedule,
            dbSchedule
        );

        return dbSchedule;
    }

    async getSchedules(): Promise<ScheduleEntity[]> {
        return this.scheduleRepository.find({
            relations: {
                shifts: {
                    nurse: true,
                },
            },
        });
    }

    async getScheduleById(id: number): Promise<any> {
        return this.scheduleRepository.findOneOrFail({
            where: { id },
            relations: {
                shifts: {
                    nurse: true,
                },
            },
        });
    }

    async getScheduleRequirements(): Promise<any> {
        // TODO: Complete the implementation of this method
        // Schedule requirements can be hard-coded
        // Requirements must indicate the number of nurses required for each shift type on each day of a week
        // Create the requirements as JSON and make it available via this method
        throw new NotImplementedException();
    }
}
