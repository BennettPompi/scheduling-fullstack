import { ShiftDTO } from "./ShiftDTO";

export type ScheduleDTO = {
    id: number;
    created: string;
    shifts: ShiftDTO[];
};
