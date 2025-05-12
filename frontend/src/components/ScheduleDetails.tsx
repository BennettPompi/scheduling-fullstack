import React, { useState } from "react";
import { ScheduleDTO, ShiftDTO } from "@m7-scheduler/dtos";
import { ShiftRequirements, NurseDTO } from "@m7-scheduler/dtos";
import { days } from "../App";

interface ScheduleDisplayProps {
    schedule: ScheduleDTO;
    requirements: ShiftRequirements[];
    nurses: NurseDTO[] | null;
}

const ScheduleDetails: React.FC<ScheduleDisplayProps> = ({
    schedule,
    requirements,
    nurses,
}) => {
    const [showDetails, setShowDetails] = useState(false);

    const nurseShiftMap: Record<number, boolean[]> = {};

    schedule.shifts?.forEach((shift: ShiftDTO) => {
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
    const meetsReqsArr: boolean[] = assignedCountArray.map(
        (count, idx) => count >= reqsArray[idx]
    );

    return (
        <div>
            <button onClick={() => setShowDetails(!showDetails)}>
                {new Date(schedule.created).toLocaleString()}
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
                                        {`Day (${
                                            assignedCountArray[idx * 2] ?? 0
                                        }/ ${reqsArray[idx * 2] ?? 0})`}
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
                                        {`Night (${
                                            assignedCountArray[idx * 2 + 1] ?? 0
                                        }/ ${reqsArray[idx * 2 + 1] ?? 0})`}
                                    </th>,
                                ])}
                            </tr>
                        </thead>
                        <tbody>
                            {nurses &&
                                nurses.map((nurse) => {
                                    const shifts =
                                        nurseShiftMap[nurse.id] ??
                                        Array(14).fill(false);
                                    return (
                                        <tr key={nurse.id}>
                                            <td>{nurse.name}</td>
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
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScheduleDetails;
