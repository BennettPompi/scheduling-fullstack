import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { NurseService } from "./nurse.service";
import { NurseEntity } from "./nurse.entity";
import { ShiftPreference } from "@m7-scheduler/dtos";

@Controller("nurses")
export class NurseController {
    constructor(private readonly nurseService: NurseService) {}

    @Get()
    async getNurses(): Promise<NurseEntity[]> {
        return this.nurseService.getNurses();
    }

    @Post("preferences")
    async setPreferences(
        @Body("id") id: number,
        @Body("preferences") preferences: ShiftPreference[]
    ): Promise<any> {
        return this.nurseService.setPreferences(id, preferences);
    }
    @Get("preferences/:id")
    async getNursePreferences(@Param("id") id: number): Promise<any> {
        return this.nurseService.getPreferences(id);
    }
}
