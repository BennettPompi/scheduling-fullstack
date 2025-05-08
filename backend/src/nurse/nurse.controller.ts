import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { NurseService } from "./nurse.service";
import { NurseEntity } from "./nurse.entity";

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
        @Body("preferences") preferences: string
    ): Promise<any> {
        const parsedPreferences = JSON.parse(preferences);
        return this.nurseService.setPreferences(id, parsedPreferences);
    }
    @Get("preferences")
    async getNursePreferences(@Query("id") id: number): Promise<any> {
        return this.nurseService.getPreferences(id);
    }
}
