import React, { useEffect, useState } from "react";
import { ScheduleDTO, ShiftDTO } from "@m7-scheduler/dtos";
import apiService from "../services/apiService";
import { ShiftRequirements } from "@m7-scheduler/dtos";
interface ScheduleDisplayProps {
    scheduleId: number;
    requirements: ShiftRequirements[];
}

const ScheduleDetails: React.FC<ScheduleDisplayProps> = ({
    scheduleId,
    requirements,
}) => {
    const [schedule, setSchedule] = useState<ScheduleDTO | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await apiService.getSchedule(scheduleId);
                setSchedule(data);
            } catch (error) {
                console.error("Error fetching schedule:", error);
            }
        };

        fetchSchedule();
    }, [scheduleId]);

    if (!schedule) {
        return <div>Loading...</div>;
    }
    // Map dayOfWeek number to day name
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const nurseShiftMap: Record<number, boolean[]> = {};

    // Build a lookup: { [nurseId]: nurseName }
    const nurseNameMap: Record<number, string> = {};

    schedule.shifts?.forEach((shift: ShiftDTO) => {
        nurseNameMap[shift.nurse.id] = shift.nurse.name;
        if (!nurseShiftMap[shift.nurse.id]) {
            nurseShiftMap[shift.nurse.id] = Array(14).fill(false);
        }
        const shiftIdx = (shift.type === "day" ? 0 : 1) + shift.dayOfWeek * 2;
        nurseShiftMap[shift.nurse.id][shiftIdx] = true;
    });

    // Build requirements lookup: dayOfWeek x shiftType -> nursesRequired
    const reqsArray = requirements.map((req) => req.nursesRequired);
    const assignedCountArray: number[] = Array(14).fill(0);
    schedule.shifts?.forEach((shift: ShiftDTO) => {
        const dayOfWeek = shift.dayOfWeek;
        const shiftType = shift.type;
        if (shiftType === "day") {
            assignedCountArray[dayOfWeek * 2] += 1;
        } else {
            assignedCountArray[dayOfWeek * 2 + 1] += 1;
        }
    });
    console.log("Assigned Count Array: ", assignedCountArray);
    const meetsReqsArr: boolean[] = assignedCountArray.map(
        (count, idx) => count >= reqsArray[idx]
    );

    const dateString = new Date(schedule.created).toLocaleString();
    return (
        <div>
            <button onClick={() => setShowDetails(!showDetails)}>
                {dateString}
            </button>
            {showDetails && (
                <div>
                    <h3>Schedule Details</h3>
                    <table
                        border={1}
                        style={{ borderCollapse: "collapse", width: "100%" }}
                    >
                        <thead>
                            <tr>
                                <th>Nurse</th>
                                {days.map((day) => (
                                    <th key={day} colSpan={2}>
                                        {day}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                <th></th>
                                {/* CLEAN THIS UP */}
                                {days.map((day, idx) => [
                                    <th
                                        key={day + "-day"}
                                        style={{
                                            background:
                                                meetsReqsArr[idx * 2] ?? false
                                                    ? "#d4ffd4"
                                                    : "#ffd4d4",
                                        }}
                                    >
                                        Day ({assignedCountArray[idx * 2] ?? 0}/
                                        {reqsArray[idx * 2] ?? 0})
                                    </th>,
                                    <th
                                        key={day + "-night"}
                                        style={{
                                            background:
                                                meetsReqsArr[idx * 2 + 1] ??
                                                false
                                                    ? "#d4ffd4"
                                                    : "#ffd4d4",
                                        }}
                                    >
                                        Night (
                                        {assignedCountArray[idx * 2 + 1] ?? 0}/
                                        {reqsArray[idx * 2 + 1] ?? 0})
                                    </th>,
                                ])}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(nurseShiftMap).map(
                                ([nurseId, shifts]) => (
                                    <tr key={nurseId}>
                                        <td>{nurseNameMap[Number(nurseId)]}</td>
                                        {shifts.map((shift, idx) => [
                                            <td
                                                key={idx + "-day"}
                                                style={{
                                                    background: shift
                                                        ? "#d4ffd4"
                                                        : "#ffd4d4",
                                                }}
                                            >
                                                {shift ? "X" : ""}
                                            </td>,
                                        ])}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScheduleDetails;
