import { ShiftPreference } from "@m7-scheduler/dtos";
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:3000";

const instance = axios.create({
    baseURL: API_BASE_URL,
});

export default {
    // Nurse endpoints
    getNurses: async () => {
        const { data } = await instance.get("/nurses");
        return data;
    },
    getNursePreferences: async (id: number) => {
        const { data }: AxiosResponse<ShiftPreference[]> = await instance.get(
            `/nurses/preferences/${id}`
        );

        return data;
    },
    setNursePreferences: async (id: number, preferences: ShiftPreference[]) => {
        const { data } = await instance.post(`/nurses/preferences`, {
            id,
            preferences,
        });
        return data;
    },

    // Shift endpoints
    getAllShifts: async () => {
        const { data } = await instance.get("/shifts");
        return data;
    },
    getShiftsByNurse: async (nurseId: number) => {
        const { data } = await instance.get(`/shifts/nurse/${nurseId}`);
        return data;
    },
    getShiftsBySchedule: async (scheduleId: number) => {
        const { data } = await instance.get(`/shifts/schedule/${scheduleId}`);
        return data;
    },
    getShiftRequirements: async () => {
        const { data } = await instance.get(`/shifts/requirements`);
        return data;
    },

    // Schedule endpoints
    generateSchedule: async () => {
        const { data } = await instance.post(`/schedules`);
        return data;
    },
    getSchedules: async () => {
        const { data } = await instance.get("/schedules");
        return data;
    },
    getSchedule: async (id: number) => {
        const { data } = await instance.get(`/schedules/${id}`);
        return data;
    },
};
