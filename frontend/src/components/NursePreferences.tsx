import React, { FormEventHandler, useEffect, useState } from "react";
import * as api from "../services/apiService";
import { DefaultShiftPreference, ShiftPreference } from "@m7-scheduler/dtos";

const NursePreferences = ({
    id,
    name,
    days,
}: {
    id: number;
    name: string;
    days: ShiftPreference[];
}) => {
    // state for show depending on button click on the nurse itself to show details page
    const [showNursePreferredShifts, setShowNursePreferredShifts] =
        useState(false);
    // preferred shifts represents nurse preferences for the week in a format that makes it easy to render
    const [nursePreferredShifts, setNursePreferredShifts] = useState<
        ShiftPreference[]
    >(Array(7).fill(DefaultShiftPreference()));
    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const shifts = ["day", "night"];

    const handleClick = () => {
        setShowNursePreferredShifts((show) => !show);
    };

    const handleSubmitPreferences = (event: any) => {
        const setPreferences = async () => {
            const shiftValues = Object.values(nursePreferredShifts);
            let shiftsToPost = shiftValues.map((shift, ind) => {
                return { dayOfWeek: days[ind], shift: shift };
            });

            // TODO: call the API to submit preferences
            console.error("Not yet implemented");
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

            setNursePreferredShifts(nursePreferences);
        };
        fetchPreferences().catch(console.error);
    }, [id]);

    // changing the preferredShifts in the page depending on the checkboxes
    const handleChange: FormEventHandler<HTMLTableDataCellElement> = (
        event: React.FormEvent
    ) => {
        for (const child of Array.from(
            event.currentTarget.children
        ) as HTMLInputElement[]) {
            if (child.type == "checkbox" && child.checked) {
                setNursePreferredShifts({
                    ...nursePreferredShifts,
                    [child.name]: child.value,
                });
                break;
            } else if (child.type == "checkbox") {
                setNursePreferredShifts({
                    ...nursePreferredShifts,
                    [child.name]: "",
                });
            }
        }
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
                                    <tr
                                        key={
                                            "preference for " +
                                            daysOfWeek[idx] +
                                            " nurse with id " +
                                            id
                                        }
                                    >
                                        <td>{daysOfWeek[idx]}</td>
                                        <td onChange={handleChange}>
                                            {nursePreferredShifts[idx]
                                                .dayShift === true ? (
                                                <input
                                                    type="checkbox"
                                                    name={daysOfWeek[idx]}
                                                    value={shifts[0]}
                                                    checked
                                                />
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    name={
                                                        daysOfWeek[idx] + "-day"
                                                    }
                                                    value={shifts[0]}
                                                />
                                            )}
                                            <label
                                                htmlFor={shifts[0]}
                                                style={{ marginRight: "5px" }}
                                            >
                                                {shifts[0]}
                                            </label>
                                            {nursePreferredShifts[idx]
                                                .nightShift === true ? (
                                                <input
                                                    type="checkbox"
                                                    name={
                                                        daysOfWeek[idx] +
                                                        "-night"
                                                    }
                                                    value={shifts[1]}
                                                    checked
                                                />
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    name={
                                                        daysOfWeek[idx] +
                                                        "-night"
                                                    }
                                                    value={shifts[1]}
                                                />
                                            )}
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
