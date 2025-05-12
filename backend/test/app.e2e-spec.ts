import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { ShiftEntity } from "@src/shift/shift.entity";
import { ScheduleDTO, ShiftDTO, ShiftRequirements } from "@m7-scheduler/dtos";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let generatedSchedules: number[] = [];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/ (GET)", () => {
        return request(app.getHttpServer())
            .get("/")
            .expect(200)
            .expect("Hello World!");
    });
    it("/nurse (GET)", () => {
        return request(app.getHttpServer()).get("/nurses").expect(200);
    });

    it("/nurses (GET) and update preferences, then generate schedule", async () => {
        // 1. Get all nurses
        const nursesRes = await request(app.getHttpServer())
            .get("/nurses")
            .expect(200);
        const nurses = nursesRes.body;

        expect(Array.isArray(nurses)).toBe(true);
        expect(nurses.length).toBeGreaterThan(0);

        // 2. Update each nurse's preferences randomly
        for (const nurse of nurses) {
            const randomPrefs = Array(7)
                .fill(0)
                .map(() => ({
                    dayShift: Math.random() > 0.75,
                    nightShift: Math.random() > 0.75,
                }));
            let availableShifts = randomPrefs.filter(
                (pref) => pref.dayShift || pref.nightShift
            );

            while (availableShifts.length < 3) {
                const randomIndex = Math.floor(
                    Math.random() * randomPrefs.length
                );
                if (
                    !randomPrefs[randomIndex].dayShift &&
                    !randomPrefs[randomIndex].nightShift
                ) {
                    if (Math.random() > 0.5) {
                        randomPrefs[randomIndex].dayShift = true;
                    } else {
                        randomPrefs[randomIndex].nightShift = true;
                    }
                    availableShifts = randomPrefs.filter(
                        (pref) => pref.dayShift || pref.nightShift
                    );
                }
            }

            expect(availableShifts.length).toBeGreaterThanOrEqual(3);

            await request(app.getHttpServer())
                .post("/nurses/preferences")
                .send({ id: nurse.id, preferences: randomPrefs })
                .expect(201);
        }

        // 3. Generate a schedule
        const scheduleRes = await request(app.getHttpServer())
            .post("/schedules")
            .expect(201);
        const schedule = scheduleRes.body;
        expect(schedule).toHaveProperty("id");
        expect(Array.isArray(schedule.shifts)).toBe(true);
        expect(schedule.shifts.length).toBeGreaterThan(0);
    });

    it("repeats schedule generation and reports shift requirement fulfillment", async () => {
        jest.setTimeout(60000); // 60 seconds
        const THRESHOLD = 4 / 14; // 75% chance of a shift being available
        const NUM_RUNS = 10;
        let totalShifts = 0;
        let totalMet = 0;
        let allResults: { met: number; total: number }[] = [];
        let availableShiftsCount = 0;
        generatedSchedules = [];
        // Get requirements (assume endpoint exists)
        const reqRes = await request(app.getHttpServer())
            .get("/shifts/requirements")
            .expect(200);
        const requirements: ShiftRequirements[] = reqRes.body; // [{ dayOfWeek, shift, nursesRequired }]
        // Randomize preferences for all nurses
        const nursesRes = await request(app.getHttpServer())
            .get("/nurses")
            .expect(200);
        const nurses = nursesRes.body;
        for (let run = 0; run < NUM_RUNS; run++) {
            for (const nurse of nurses) {
                const randomPrefs = Array(7)
                    .fill(0)
                    .map(() => ({
                        dayShift: Math.random() > 1 - THRESHOLD,
                        nightShift: Math.random() > 1 - THRESHOLD,
                    }));
                let availableShifts = randomPrefs.filter(
                    (pref) => pref.dayShift || pref.nightShift
                );
                while (availableShifts.length < 3) {
                    const randomIndex = Math.floor(
                        Math.random() * randomPrefs.length
                    );
                    if (
                        !randomPrefs[randomIndex].dayShift &&
                        !randomPrefs[randomIndex].nightShift
                    ) {
                        if (Math.random() > 0.5) {
                            randomPrefs[randomIndex].dayShift = true;
                        } else {
                            randomPrefs[randomIndex].nightShift = true;
                        }
                        availableShifts = randomPrefs.filter(
                            (pref) => pref.dayShift || pref.nightShift
                        );
                    }
                }
                expect(availableShifts.length).toBeGreaterThanOrEqual(3);
                availableShiftsCount += availableShifts.length;
                await request(app.getHttpServer())
                    .post("/nurses/preferences")
                    .send({ id: nurse.id, preferences: randomPrefs })
                    .expect(201);
            }
            // Generate schedule
            const scheduleRes = await request(app.getHttpServer())
                .post("/schedules")
                .expect(201);
            const schedule: ScheduleDTO = scheduleRes.body;
            generatedSchedules.push(schedule.id);
            // Count fulfillment
            let met = 0;
            let total = 0;
            for (const req of requirements) {
                const count = schedule.shifts.filter(
                    (s: ShiftDTO) =>
                        s.dayOfWeek === req.dayOfWeek && s.type === req.shift
                ).length;
                if (count >= req.nursesRequired) met++;
                total++;
            }
            allResults.push({ met, total });
            totalShifts += total;
            totalMet += met;
        }
        const avgAvailableShifts =
            availableShiftsCount / (NUM_RUNS * nurses.length);
        console.log(
            `\nAverage available shifts per nurse: ${avgAvailableShifts.toFixed(
                2
            )} over ${NUM_RUNS} runs.`
        );
        const percent = ((totalMet / totalShifts) * 100).toFixed(2);
        // eslint-disable-next-line no-console
        console.log(
            `\nSchedule requirement fulfillment: ${totalMet}/${totalShifts} (${percent}%) over ${NUM_RUNS} runs.`
        );

        expect(percent).toBeDefined();
    });

    afterAll(async () => {
        for (const id of generatedSchedules) {
            await request(app.getHttpServer())
                .delete(`/schedules/${id}`)
                .expect(200);
        }
        await app.close();
    });
});
