import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    NotImplementedException,
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
    async getSchedule(@Param("id") id: number): Promise<ScheduleDTO> {
        return this.scheduleService.getScheduleById(id);
    }

    @Post()
    async generateSchedule(): Promise<ScheduleEntity> {
        return this.scheduleService.generateSchedule();
    }
}
