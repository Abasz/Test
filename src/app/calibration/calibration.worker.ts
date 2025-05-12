import { ICalibrationRowingMetrics, IRowingMetrics, IRowingProfile } from "./calibration.interfaces";
import { StrokeService } from "./stroke.service";
// / <reference lib="webworker" />

async function runSimulation(
    deltaTimes: Array<number>,
    profile: IRowingProfile,
): Promise<ICalibrationRowingMetrics> {
    let rawImpulseCount = 0;
    let totalTime = 0;
    let totalAngularDisplacement = 0;
    const rowingMetrics: Array<IRowingMetrics> = [];
    let minDeltaTime = Number.MAX_SAFE_INTEGER;

    const deltaTimesLog: Array<number> = [];
    const strokeService = new StrokeService(profile);

    deltaTimes.forEach((deltaTime: number): void => {
        minDeltaTime = Math.min(minDeltaTime, deltaTime);
        if (deltaTime < profile.rotationDebounceTimeMin * 1000) {
            return;
        }

        const angularDisplacementPerImpulse = (2 * Math.PI) / profile.impulsesPerRevolution;

        deltaTimesLog.push(deltaTime);
        totalAngularDisplacement += angularDisplacementPerImpulse;
        totalTime += deltaTime;
        rawImpulseCount++;

        const data = {
            rawImpulseCount,
            deltaTime,
            totalTime,
            totalAngularDisplacement,
            cleanImpulseTime: totalTime,
            rawImpulseTime: totalTime,
        };

        strokeService.processData(data);

        const prevStrokeCount = rowingMetrics[rowingMetrics.length - 1]?.strokeCount ?? 0;
        const rowingMetric = strokeService.getData();

        if (rowingMetric.strokeCount > prevStrokeCount) {
            deltaTimesLog.push(rowingMetric.strokeCount);

            rowingMetrics.push(rowingMetric);
        }
    });

    rowingMetrics.push(strokeService.getData());

    return {
        marginDetect: strokeService.getMarginDetectCount(),
        rowingMetrics,
        deltaTimesLog,
        minDeltaTimeChartValue: Math.floor(minDeltaTime / 1_000) * 1_000,
    };
}

addEventListener(
    "message",
    async ({
        data: { deltaTimes, settings },
    }: MessageEvent<{ deltaTimes: Array<number>; settings: IRowingProfile }>): Promise<void> => {
        postMessage(await runSimulation(deltaTimes, settings));
    },
);
