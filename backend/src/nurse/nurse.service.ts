import { Injectable } from "@nestjs/common";
import { NurseEntity } from "./nurse.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ShiftPreference } from "@m7-scheduler/dtos";

@Injectable()
export class NurseService {
    constructor(
        @InjectRepository(NurseEntity)
        private nurseRepository: Repository<NurseEntity>
    ) {}

    async getNurses(): Promise<NurseEntity[]> {
        return this.nurseRepository.find();
    }

    async setPreferences(
        id: number,
        preferences: ShiftPreference[]
    ): Promise<NurseEntity> {
        const nurse = await this.nurseRepository.findOneByOrFail({ id });
        if (!nurse) {
            throw new Error(`Nurse with ID ${id} not found`);
        }
        nurse.preferences = preferences;
        return this.nurseRepository.save(nurse);
    }
    async getPreferences(id: number) {
        const nurse = await this.nurseRepository.findOneBy({ id });
        return nurse?.preferences;
    }
}
