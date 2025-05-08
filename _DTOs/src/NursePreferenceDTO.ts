export type ShiftPreference = {
    dayShift: boolean;
    nightShift: boolean;
};
export const DefaultShiftPreference = (): ShiftPreference => {
    return {
        dayShift: false,
        nightShift: false,
    };
};
