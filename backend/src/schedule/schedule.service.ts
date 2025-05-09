import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ScheduleEntity } from "./schedule.entity";

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(ScheduleEntity)
        private readonly scheduleRepository: Repository<ScheduleEntity>
    ) {}

    async generateSchedule(startDate: Date, endDate: Date): Promise<any> {
        /* 
            1. Go through nurses/prefs, create list of nurses available for each shift
            2. Maintain count of nurses assigned to each shift, sort each shift pool by count (asc)
            3. For each shift, assign nurses from ordered pool until all shifts are filled
                a. Check that the nurse is not assigned to the previous shift.
                If they are, exclude them unless we need them
                If they were assigned to the previous 2 shifts, exclude them no matter what
            FINALLY: Iterate through shift assignments, create shift objects for each of them
        */
        throw new NotImplementedException();
    }

    async getSchedules(): Promise<ScheduleEntity[]> {
        return this.scheduleRepository.find();
    }

    async getScheduleById(id: number): Promise<any> {
        return this.scheduleRepository.findOneByOrFail({ id });
    }

    async getScheduleRequirements(): Promise<any> {
        // TODO: Complete the implementation of this method
        // Schedule requirements can be hard-coded
        // Requirements must indicate the number of nurses required for each shift type on each day of a week
        // Create the requirements as JSON and make it available via this method
        throw new NotImplementedException();
    }
}
