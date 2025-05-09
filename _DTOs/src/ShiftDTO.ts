export type ShiftType = "day" | "night";
export type ShiftDTO = {
    type: ShiftType;
    // The day of the week represented as a number (0-6, where 0 is Monday)
    dayOfWeek: number;
    nurseId: number;
    scheduleId: number;
};
