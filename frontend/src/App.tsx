import { useEffect, useState } from "react";
import * as api from "./services/apiService";
import m7Logo from "/Logo-black.png";
import "./App.css";
import NursePreferences from "./components/NursePreferences";
import ScheduleDetails from "./components/ScheduleDetails";
import { NurseDTO, ScheduleDTO, ShiftRequirements } from "@m7-scheduler/dtos";

export const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

function App() {
    const [nurses, setNurses] = useState<NurseDTO[]>([]);
    const [requirements, setRequirements] = useState<ShiftRequirements[]>([]);
    const [schedules, setSchedules] = useState<ScheduleDTO[]>([]);

    useEffect(() => {
        const fetchNurses = async () => {
            const nurses = await api.default.getNurses(); // Issue only in dev mode (StrictMode: true)
            setNurses(nurses);
        };

        fetchNurses().catch(console.error);
    }, []);

    useEffect(() => {
        const fetchRequirements = async () => {
            const requirements = await api.default.getShiftRequirements();
            setRequirements(requirements);
        };

        fetchRequirements().catch(console.error);
    }, []);
    useEffect(() => {
        const fetchSchedules = async () => {
            const schedules = await api.default.getSchedules();
            setSchedules(schedules);
        };
        fetchSchedules().catch(console.error);
    }, []);

    return (
        <>
            <div>
                <a href="https://m7health.com" target="_blank">
                    <img src={m7Logo} className="logo" alt="M7 Health logo" />
                </a>
            </div>
            <h1>M7 Health scheduling exercise</h1>
            <div className="card">
                Check the README for guidance on how to complete this exercise.
                Find inspiration{" "}
                <a href="https://www.m7health.com/product" target="_blank">
                    on M7's site
                </a>
                .
            </div>
            <div className="card">
                <h2>Nurses</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nurses &&
                            nurses.map((nurse: NurseDTO) => (
                                <tr key={nurse.id}>
                                    <td>{nurse.id}</td>
                                    <td>
                                        <NursePreferences
                                            id={nurse.id}
                                            name={nurse.name}
                                            days={days}
                                        />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="card">
                <h2>Shift Requirements</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Shift</th>
                            <th>Nurses required</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requirements &&
                            requirements.map((req: ShiftRequirements) => (
                                <tr key={req.dayOfWeek + "-" + req.shift}>
                                    <td>{days[req.dayOfWeek]}</td>
                                    <td>{req.shift}</td>
                                    <td>{req.nursesRequired}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div>
                <button
                    onClick={async () => {
                        const schedule = await api.default.generateSchedule();
                        const prevSchedules = schedules || [];
                        const newSchedules = [...prevSchedules, schedule];
                        setSchedules(newSchedules);
                    }}
                >
                    Generate Schedule
                </button>
            </div>
            <div className="card">
                <h2>Schedules</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules &&
                            schedules
                                .map((schedule: ScheduleDTO) => (
                                    <tr key={schedule.id}>
                                        <td>{schedule.id}</td>
                                        <td>
                                            <ScheduleDetails
                                                schedule={schedule}
                                                requirements={requirements}
                                                nurses={nurses}
                                            />
                                        </td>
                                    </tr>
                                ))
                                .reverse()}
                    </tbody>
                </table>
                {!schedules ||
                    (schedules.length === 0 && (
                        <div>
                            No schedules available. Please generate a schedule.
                        </div>
                    ))}
            </div>
        </>
    );
}

export default App;
