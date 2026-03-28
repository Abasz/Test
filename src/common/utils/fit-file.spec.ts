import { Decoder, Stream, Utils } from "@garmin/fitsdk";
import { beforeEach, describe, expect, it } from "vitest";

import { IExportRecord, IExportSession } from "../database.interfaces";

import { createSessionFitFile } from "./fit-file";

function decodeValidMessages(fitData: Uint8Array): Record<string, Array<Record<string, unknown>>> {
    const stream = Stream.fromArrayBuffer(fitData.buffer);
    const decoder = new Decoder(stream);
    const result: ReturnType<Decoder["read"]> = decoder.read();
    expect(result.errors).toHaveLength(0);

    return result.messages;
}

function createTestSession(overrides?: Partial<IExportSession>): IExportSession {
    const sessionId = new Date("2026-01-15T10:00:00Z").getTime();
    const baseTime = new Date("2026-01-15T10:00:01Z");

    return {
        sessionId,
        deviceName: "Test Rower",
        records: [
            {
                timeStamp: new Date(baseTime.getTime()),
                elapsedTime: 1,
                distance: 200,
                speed: 2.0,
                strokeRate: 24,
                strokeCount: 1,
                avgStrokePower: 150,
                distPerStroke: 8.0,
                driveDuration: 0.8,
                recoveryDuration: 1.7,
                dragFactor: 110,
                heartRate: {
                    heartRate: 120,
                    contactDetected: true,
                    rrIntervals: [500, 510],
                },
            },
            {
                timeStamp: new Date(baseTime.getTime() + 1000),
                elapsedTime: 2,
                distance: 450,
                speed: 2.5,
                strokeRate: 26,
                strokeCount: 2,
                avgStrokePower: 160,
                distPerStroke: 8.5,
                driveDuration: 0.75,
                recoveryDuration: 1.55,
                dragFactor: 112,
                heartRate: {
                    heartRate: 130,
                    contactDetected: true,
                    rrIntervals: [480],
                },
            },
            {
                timeStamp: new Date(baseTime.getTime() + 2000),
                elapsedTime: 3,
                distance: 750,
                speed: 3.0,
                strokeRate: 28,
                strokeCount: 3,
                avgStrokePower: 170,
                distPerStroke: 9.0,
                driveDuration: 0.7,
                recoveryDuration: 1.4,
                dragFactor: 115,
                heartRate: {
                    heartRate: 140,
                    contactDetected: true,
                },
            },
        ],
        handleForces: {},
        ...overrides,
    };
}

describe("createSessionFitFile function", (): void => {
    let testSession: IExportSession;

    beforeEach((): void => {
        testSession = createTestSession();
    });

    describe("as part of FIT file structure", (): void => {
        it("should return a Uint8Array", (): void => {
            const result = createSessionFitFile(testSession);

            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBeGreaterThan(0);
        });

        it("should produce a valid FIT file that decodes without errors", (): void => {
            const fitData = createSessionFitFile(testSession);
            const stream = Stream.fromArrayBuffer(fitData.buffer);
            const decoder = new Decoder(stream);

            expect(decoder.isFIT()).toBe(true);
            expect(decoder.checkIntegrity()).toBe(true);
        });

        it("should contain a FileId message with type activity", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["fileIdMesgs"]).toHaveLength(1);
            expect(messages["fileIdMesgs"][0]["type"]).toBe("activity");
            expect(messages["fileIdMesgs"][0]["manufacturer"]).toBe("development");
        });

        it("should contain a FileCreator message", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["fileCreatorMesgs"]).toHaveLength(1);
            expect(messages["fileCreatorMesgs"][0]["softwareVersion"]).toBe(100);
        });

        it("should contain a DeviceInfo message with device name", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["deviceInfoMesgs"]).toHaveLength(1);
            expect(messages["deviceInfoMesgs"][0]["productName"]).toBe("Test Rower");
        });

        it("should use default device name when deviceName is undefined", (): void => {
            testSession.deviceName = undefined;
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["deviceInfoMesgs"][0]["productName"]).toBe("ESP Rowing Monitor");
        });

        it("should contain a Sport message with rowing/indoorRowing", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["sportMesgs"]).toHaveLength(1);
            expect(messages["sportMesgs"][0]["sport"]).toBe("rowing");
            expect(messages["sportMesgs"][0]["subSport"]).toBe("indoorRowing");
        });

        it("should contain an Activity message", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["activityMesgs"]).toHaveLength(1);
            expect(messages["activityMesgs"][0]["numSessions"]).toBe(1);
        });

        it("should compute localTimestamp from session end time timezone", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const activity = messages["activityMesgs"][0];
            const endTime = testSession.records[testSession.records.length - 1].timeStamp;
            const endDateTime = Utils.convertDateToDateTime(endTime);
            const expectedLocal = endDateTime + endTime.getTimezoneOffset() * -60;

            expect(activity["localTimestamp"]).toBe(expectedLocal);
        });
    });

    describe("as part of Record messages", (): void => {
        it("should contain one Record per data point", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"]).toHaveLength(3);
        });

        it("should convert distance from cm to meters", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["distance"]).toBe(2);
            expect(messages["recordMesgs"][1]["distance"]).toBe(4.5);
            expect(messages["recordMesgs"][2]["distance"]).toBe(7.5);
        });

        it("should map speed to enhancedSpeed", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["enhancedSpeed"]).toBe(2.0);
            expect(messages["recordMesgs"][1]["enhancedSpeed"]).toBe(2.5);
        });

        it("should round strokeRate to cadence", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["cadence"]).toBe(24);
            expect(messages["recordMesgs"][1]["cadence"]).toBe(26);
        });

        it("should round avgStrokePower to power", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["power"]).toBe(150);
            expect(messages["recordMesgs"][1]["power"]).toBe(160);
        });

        it("should include heartRate when present", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["heartRate"]).toBe(120);
            expect(messages["recordMesgs"][2]["heartRate"]).toBe(140);
        });

        it("should include totalCycles from strokeCount", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["totalCycles"]).toBe(1);
            expect(messages["recordMesgs"][2]["totalCycles"]).toBe(3);
        });

        it("should include resistance from dragFactor", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["resistance"]).toBe(110);
            expect(messages["recordMesgs"][2]["resistance"]).toBe(115);
        });

        it("should set activityType to fitnessEquipment", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["activityType"]).toBe("fitnessEquipment");
        });

        it("should set correct timestamps", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const firstTimestamp = messages["recordMesgs"][0]["timestamp"] as Date;
            const secondTimestamp = messages["recordMesgs"][1]["timestamp"] as Date;

            expect(secondTimestamp.getTime() - firstTimestamp.getTime()).toBe(1000);
        });
    });

    describe("as part of HRV messages", (): void => {
        it("should emit HRV messages for records with rrIntervals", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["hrvMesgs"]).toHaveLength(2);
        });

        it("should convert rrIntervals from ms to seconds", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["hrvMesgs"][0]["time"]).toEqual([0.5, 0.51]);
            // sdk decoder unwraps single-element arrays to scalar values (sanitizeValues)
            expect(messages["hrvMesgs"][1]["time"]).toBe(0.48);
        });

        it("should not emit HRV messages when rrIntervals are absent", (): void => {
            testSession = createTestSession({
                records: testSession.records.map(
                    (record: IExportRecord): IExportRecord => ({
                        ...record,
                        heartRate: record.heartRate
                            ? { heartRate: record.heartRate.heartRate, contactDetected: true }
                            : undefined,
                    }),
                ),
            });
            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["hrvMesgs"]).toBeUndefined();
        });
    });

    describe("as part of Event messages", (): void => {
        it("should contain timer start and stop events", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const events = messages["eventMesgs"];

            expect(events).toHaveLength(2);
            expect(events[0]["event"]).toBe("timer");
            expect(events[0]["eventType"]).toBe("start");
            expect(events[1]["event"]).toBe("timer");
            expect(events[1]["eventType"]).toBe("stopAll");
        });
    });

    describe("as part of Lap summary", (): void => {
        it("should contain one Lap with correct summary stats", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const lap = messages["lapMesgs"][0];

            expect(messages["lapMesgs"]).toHaveLength(1);
            expect(lap["sport"]).toBe("rowing");
            expect(lap["subSport"]).toBe("indoorRowing");
            expect(lap["totalElapsedTime"]).toBe(3);
            expect(lap["totalTimerTime"]).toBe(3);
            expect(lap["totalDistance"]).toBe(7.5);
            expect(lap["totalCycles"]).toBe(3);
        });

        it("should compute correct average and max cadence", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const lap = messages["lapMesgs"][0];

            expect(lap["avgCadence"]).toBe(26);
            expect(lap["maxCadence"]).toBe(28);
        });

        it("should compute correct average and max power", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const lap = messages["lapMesgs"][0];

            expect(lap["avgPower"]).toBe(160);
            expect(lap["maxPower"]).toBe(170);
        });

        it("should compute correct average and max heart rate", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const lap = messages["lapMesgs"][0];

            expect(lap["avgHeartRate"]).toBe(130);
            expect(lap["maxHeartRate"]).toBe(140);
        });

        it("should compute correct average and max speed", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const lap = messages["lapMesgs"][0];

            expect(lap["enhancedAvgSpeed"]).toBeCloseTo(2.5, 5);
            expect(lap["enhancedMaxSpeed"]).toBe(3.0);
        });

        it("should compute correct average stroke distance", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const lap = messages["lapMesgs"][0];

            expect(lap["avgStrokeDistance"]).toBeCloseTo(8.5, 5);
        });
    });

    describe("as part of Session summary", (): void => {
        it("should contain one Session with correct fields", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const session = messages["sessionMesgs"][0];

            expect(messages["sessionMesgs"]).toHaveLength(1);
            expect(session["sport"]).toBe("rowing");
            expect(session["subSport"]).toBe("indoorRowing");
            expect(session["numLaps"]).toBe(1);
            expect(session["firstLapIndex"]).toBe(0);
            expect(session["event"]).toBe("session");
            expect(session["eventType"]).toBe("stop");
            expect(session["trigger"]).toBe("activityEnd");
            expect(session["sportProfileName"]).toBe("Row Indoor");
        });

        it("should contain the same summary stats as the Lap", (): void => {
            const messages = decodeValidMessages(createSessionFitFile(testSession));
            const lap = messages["lapMesgs"][0];
            const session = messages["sessionMesgs"][0];

            expect(session["totalElapsedTime"]).toBe(lap["totalElapsedTime"]);
            expect(session["totalDistance"]).toBe(lap["totalDistance"]);
            expect(session["avgPower"]).toBe(lap["avgPower"]);
            expect(session["maxPower"]).toBe(lap["maxPower"]);
            expect(session["avgCadence"]).toBe(lap["avgCadence"]);
            expect(session["maxCadence"]).toBe(lap["maxCadence"]);
            expect(session["enhancedAvgSpeed"]).toBe(lap["enhancedAvgSpeed"]);
            expect(session["enhancedMaxSpeed"]).toBe(lap["enhancedMaxSpeed"]);
            expect(session["avgStrokeDistance"]).toBe(lap["avgStrokeDistance"]);
        });
    });

    describe("as part of edge cases & robustness handling", (): void => {
        it("should throw when records array is empty", (): void => {
            testSession = createTestSession({ records: [] });

            expect((): void => {
                createSessionFitFile(testSession);
            }).toThrow("Cannot create FIT file from empty session");
        });

        it("should handle a single-record session", (): void => {
            testSession = createTestSession({
                records: [testSession.records[0]],
            });

            const fitData = createSessionFitFile(testSession);
            const messages = decodeValidMessages(fitData);

            expect(messages["recordMesgs"]).toHaveLength(1);
            expect(messages["lapMesgs"]).toHaveLength(1);
            expect(messages["sessionMesgs"]).toHaveLength(1);
            expect(messages["activityMesgs"]).toHaveLength(1);
        });

        it("should handle session with no heart rate data", (): void => {
            testSession = createTestSession({
                records: testSession.records.map(
                    (record: IExportRecord): IExportRecord => ({
                        ...record,
                        heartRate: undefined,
                    }),
                ),
            });

            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["heartRate"]).toBeUndefined();
            expect(messages["lapMesgs"][0]["avgHeartRate"]).toBeUndefined();
            expect(messages["sessionMesgs"][0]["avgHeartRate"]).toBeUndefined();
            expect(messages["hrvMesgs"]).toBeUndefined();
        });

        it("should omit resistance when dragFactor is 0", (): void => {
            testSession = createTestSession({
                records: testSession.records.map(
                    (record: IExportRecord): IExportRecord => ({
                        ...record,
                        dragFactor: 0,
                    }),
                ),
            });

            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["resistance"]).toBeUndefined();
        });

        it("should omit resistance when dragFactor is 255 or higher", (): void => {
            testSession = createTestSession({
                records: testSession.records.map(
                    (record: IExportRecord): IExportRecord => ({
                        ...record,
                        dragFactor: 255,
                    }),
                ),
            });

            const messages = decodeValidMessages(createSessionFitFile(testSession));

            expect(messages["recordMesgs"][0]["resistance"]).toBeUndefined();
        });
    });
});
