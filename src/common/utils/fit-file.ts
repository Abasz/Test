import { Encoder, Profile, Utils } from "@garmin/fitsdk";

import { IExportRecord, IExportSession } from "../database.interfaces";

interface SessionStats {
    avgCadence: number;
    maxCadence: number;
    avgPower: number;
    maxPower: number;
    avgSpeed: number;
    maxSpeed: number;
    avgHeartRate: number | undefined;
    maxHeartRate: number | undefined;
    avgStrokeDistance: number;
    totalDistance: number;
    totalElapsedTime: number;
    totalCycles: number;
}

function computeStats(records: Array<IExportRecord>): SessionStats {
    const lastRecord = records[records.length - 1];

    let cadenceSum = 0;
    let cadenceCount = 0;
    let maxCadence = 0;

    let powerSum = 0;
    let powerCount = 0;
    let maxPower = 0;

    let heartRateSum = 0;
    let heartRateCount = 0;
    let maxHeartRate = 0;

    let speedSum = 0;
    let speedCount = 0;
    let maxSpeed = 0;

    let strokeDistanceSum = 0;
    let strokeDistanceCount = 0;

    for (const record of records) {
        if (record.strokeRate > 0) {
            cadenceSum += record.strokeRate;
            cadenceCount++;
            maxCadence = Math.max(maxCadence, record.strokeRate);
        }

        if (record.avgStrokePower > 0) {
            powerSum += record.avgStrokePower;
            powerCount++;
            maxPower = Math.max(maxPower, record.avgStrokePower);
        }

        if (record.speed > 0) {
            speedSum += record.speed;
            speedCount++;
            maxSpeed = Math.max(maxSpeed, record.speed);
        }

        if (record.heartRate !== undefined) {
            heartRateSum += record.heartRate.heartRate;
            heartRateCount++;
            maxHeartRate = Math.max(maxHeartRate, record.heartRate.heartRate);
        }

        if (record.distPerStroke > 0) {
            strokeDistanceSum += record.distPerStroke;
            strokeDistanceCount++;
        }
    }

    return {
        avgCadence: cadenceCount > 0 ? Math.round(cadenceSum / cadenceCount) : 0,
        maxCadence: Math.round(maxCadence),
        avgPower: powerCount > 0 ? Math.round(powerSum / powerCount) : 0,
        maxPower: Math.round(maxPower),
        avgSpeed: speedCount > 0 ? speedSum / speedCount : 0,
        maxSpeed,
        avgHeartRate: heartRateCount > 0 ? Math.round(heartRateSum / heartRateCount) : undefined,
        maxHeartRate: heartRateCount > 0 ? maxHeartRate : undefined,
        avgStrokeDistance: strokeDistanceCount > 0 ? strokeDistanceSum / strokeDistanceCount : 0,
        totalDistance: lastRecord.distance / 100,
        totalElapsedTime: lastRecord.elapsedTime,
        totalCycles: lastRecord.strokeCount,
    };
}

function buildRecordMesg(record: IExportRecord): Record<string, unknown> {
    const mesg: Record<string, unknown> = {
        timestamp: Utils.convertDateToDateTime(record.timeStamp),
        distance: record.distance / 100,
        enhancedSpeed: record.speed,
        cadence: Math.round(record.strokeRate),
        power: Math.round(record.avgStrokePower),
        totalCycles: record.strokeCount,
        activityType: "fitnessEquipment",
    };

    if (record.heartRate !== undefined) {
        mesg["heartRate"] = record.heartRate.heartRate;
    }

    const dragFactor = Math.round(record.dragFactor);
    if (dragFactor > 0 && dragFactor < 255) {
        mesg["resistance"] = dragFactor;
    }

    return mesg;
}

export function createSessionFitFile(exportSession: IExportSession): Uint8Array {
    const { sessionId, records }: { sessionId: number; records: Array<IExportRecord> } = exportSession;

    if (records.length === 0) {
        throw new Error("Cannot create FIT file from empty session");
    }

    const encoder = new Encoder();

    const startTime = records[0].timeStamp;
    const endTime = records[records.length - 1].timeStamp;
    const startDateTime = Utils.convertDateToDateTime(startTime);
    const endDateTime = Utils.convertDateToDateTime(endTime);
    const stats = computeStats(records);

    encoder.onMesg(Profile.MesgNum.FILE_ID, {
        type: "activity",
        manufacturer: "development",
        product: 0,
        timeCreated: startDateTime,
        serialNumber: sessionId,
    });

    encoder.onMesg(Profile.MesgNum.FILE_CREATOR, {
        softwareVersion: 100,
    });

    encoder.onMesg(Profile.MesgNum.DEVICE_INFO, {
        deviceIndex: "creator",
        manufacturer: "development",
        product: 0,
        productName: exportSession.deviceName ?? "ESP Rowing Monitor",
        timestamp: startDateTime,
    });

    encoder.onMesg(Profile.MesgNum.SPORT, {
        sport: "rowing",
        subSport: "indoorRowing",
        name: "Indoor Rowing",
    });

    encoder.onMesg(Profile.MesgNum.EVENT, {
        event: "timer",
        eventType: "start",
        eventGroup: 0,
        timestamp: startDateTime,
    });

    for (const record of records) {
        encoder.onMesg(Profile.MesgNum.RECORD, buildRecordMesg(record));

        if (record.heartRate?.rrIntervals !== undefined && record.heartRate.rrIntervals.length > 0) {
            encoder.onMesg(Profile.MesgNum.HRV, {
                time: record.heartRate.rrIntervals.map((ms: number): number => ms / 1000),
            });
        }
    }

    encoder.onMesg(Profile.MesgNum.EVENT, {
        event: "timer",
        eventType: "stopAll",
        eventGroup: 0,
        timestamp: endDateTime,
    });

    const lapAndSessionFields: Record<string, unknown> = {
        sport: "rowing",
        subSport: "indoorRowing",
        totalElapsedTime: stats.totalElapsedTime,
        totalTimerTime: stats.totalElapsedTime,
        totalDistance: stats.totalDistance,
        avgCadence: stats.avgCadence,
        maxCadence: stats.maxCadence,
        avgPower: stats.avgPower,
        maxPower: stats.maxPower,
        enhancedAvgSpeed: stats.avgSpeed,
        enhancedMaxSpeed: stats.maxSpeed,
        totalCycles: stats.totalCycles,
        avgStrokeDistance: stats.avgStrokeDistance,
    };

    if (stats.avgHeartRate !== undefined) {
        lapAndSessionFields["avgHeartRate"] = stats.avgHeartRate;
        lapAndSessionFields["maxHeartRate"] = stats.maxHeartRate;
    }

    encoder.onMesg(Profile.MesgNum.LAP, {
        messageIndex: 0,
        timestamp: endDateTime,
        startTime: startDateTime,
        ...lapAndSessionFields,
    });

    encoder.onMesg(Profile.MesgNum.SESSION, {
        messageIndex: 0,
        timestamp: endDateTime,
        startTime: startDateTime,
        firstLapIndex: 0,
        numLaps: 1,
        event: "session",
        eventType: "stop",
        trigger: "activityEnd",
        sportProfileName: "Row Indoor",
        ...lapAndSessionFields,
    });

    encoder.onMesg(Profile.MesgNum.ACTIVITY, {
        timestamp: endDateTime,
        numSessions: 1,
        totalTimerTime: stats.totalElapsedTime,
        localTimestamp: endDateTime + endTime.getTimezoneOffset() * -60,
        event: "activity",
        eventType: "stop",
    });

    return encoder.close();
}
