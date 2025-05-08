import React, { FormEventHandler, useEffect, useState } from "react";
import apiService, * as api from "../services/apiService";
import { DefaultShiftPreference, ShiftPreference } from "@m7-scheduler/dtos";

const NursePreferences = ({
    id,
    name,
    days,
}: {
    id: number;
    name: string;
    days: string[];
}) => {
    // state for show depending on button click on the nurse itself to show details page
    const [showNursePreferredShifts, setShowNursePreferredShifts] =
        useState(false);
    // preferred shifts represents nurse preferences for the week in a format that makes it easy to render
    const [nurseShiftPreferences, setNurseShiftPreferences] = useState<
        ShiftPreference[]
    >(Array(7).fill(DefaultShiftPreference()));

    const shifts = ["day", "night"];

    const handleClick = () => {
        setShowNursePreferredShifts((show) => !show);
    };

    const handleSubmitPreferences = (event: any) => {
        const setPreferences = async () => {
            apiService.setNursePreferences(id, nurseShiftPreferences);
        };
        event.preventDefault();
        setPreferences().catch(console.error);
    };

    useEffect(() => {
        const fetchPreferences = async () => {
            let nursePreferences = await api.default.getNursePreferences(id);
            if (!nursePreferences) {
                throw Error(`No preferences found for nurse ${name}: ${id}`);
            }

            setNurseShiftPreferences(nursePreferences);
        };
        fetchPreferences().catch(console.error);
    }, [id]);

    // changing the preferredShifts in the page depending on the checkboxes
    const handleChange: FormEventHandler<HTMLInputElement> = (
        event: React.FormEvent<HTMLInputElement>
    ) => {
        const checkboxId = event.currentTarget.name.split("-");
        const idx = Number(checkboxId[0]);
        const shiftType = checkboxId[1];
        const dayPrefs = nurseShiftPreferences[idx];
        if (shiftType == "day") {
            dayPrefs.dayShift = event.currentTarget.checked;
        } else {
            dayPrefs.nightShift = event.currentTarget.checked;
        }

        const newPrefs = [...nurseShiftPreferences];
        newPrefs[idx] = dayPrefs;
        console.log(newPrefs);
        setNurseShiftPreferences(newPrefs);
    };

    return (
        <div>
            <button onClick={handleClick}>{name}</button>
            {showNursePreferredShifts && (
                <div>
                    Pick at least 3 preferred shifts for the week:
                    <form onSubmit={handleSubmitPreferences}>
                        <table className="nurse-preferences">
                            <thead>
                                <tr>
                                    <th>Day of the Week:</th>
                                    <th>Type of Shift:</th>
                                </tr>
                            </thead>
                            <tbody>
                                {days.map((day, idx) => (
                                    <tr>
                                        <td>{day}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name={idx + "-day"}
                                                checked={
                                                    nurseShiftPreferences[idx]
                                                        .dayShift
                                                }
                                                onChange={handleChange}
                                            />
                                            <label
                                                htmlFor={shifts[0]}
                                                style={{ marginRight: "5px" }}
                                            >
                                                {shifts[0]}
                                            </label>
                                            <input
                                                type="checkbox"
                                                name={idx + "-night"}
                                                checked={
                                                    nurseShiftPreferences[idx]
                                                        .nightShift
                                                }
                                                onChange={handleChange}
                                            />
                                            <label htmlFor={shifts[1]}>
                                                {shifts[1]}
                                            </label>
                                            <br />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <input type="submit" name="submit" value="Submit" />
                    </form>
                </div>
            )}
        </div>
    );
};

export default NursePreferences;
