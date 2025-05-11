import { ShiftType } from "./ShiftDTO";

export type ShiftRequirements = {
    shift: ShiftType;
    nursesRequired: number;
    dayOfWeek: number;
};
