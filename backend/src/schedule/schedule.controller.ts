import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    NotImplementedException,
    Delete,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleEntity } from "./schedule.entity";
import { ScheduleDTO } from "@m7-scheduler/dtos";

@Controller("schedules")
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Get()
    async getSchedules(): Promise<ScheduleEntity[]> {
        return this.scheduleService.getSchedules();
    }

    @Get("/:id")
    async getSchedule(@Param("id") id: number): Promise<ScheduleEntity> {
        return this.scheduleService.getScheduleById(id);
    }

    @Post()
    async generateSchedule(): Promise<ScheduleEntity> {
        return this.scheduleService.generateSchedule();
    }
    @Delete("/:id")
    async deleteSchedule(@Param("id") id: number): Promise<void> {
        return await this.scheduleService.deleteSchedule(id);
    }
}
