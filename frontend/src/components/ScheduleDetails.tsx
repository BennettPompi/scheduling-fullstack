import React, { useEffect, useState } from "react";
import { ScheduleDTO } from "@m7-scheduler/dtos";
import apiService from "../services/apiService";
interface ScheduleDisplayProps {
    scheduleId: number;
}

const ScheduleDetails: React.FC<ScheduleDisplayProps> = ({ scheduleId }) => {
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
    console.log("Schedule data:", schedule);
    const dateString = schedule.created;
    return (
        <div>
            <button onClick={() => setShowDetails(!showDetails)}>
                {dateString}
            </button>
            {showDetails && (
                <div>
                    <h3>Schedule Details</h3>
                    <pre>{JSON.stringify(schedule, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ScheduleDetails;
