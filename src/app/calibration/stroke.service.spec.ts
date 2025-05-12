import { signal } from "@angular/core";

import { IRowingMetrics, IRowingProfile, StrokeDetectionType } from "./calibration.interfaces";
import { RowingProfileManagerService } from "./rowing-profile-manager.service";
import { StrokeService } from "./stroke.service";
import { deltaTimes } from "./test-data/stroke.service.spec.deltaTimes";
import { dragFactors } from "./test-data/stroke.service.spec.dragFactor";
import { forceCurves } from "./test-data/stroke.service.spec.forceCurves";
import { slopes } from "./test-data/stroke.service.spec.slope";
import { torques } from "./test-data/stroke.service.spec.torque";

export const RowingProfile: IRowingProfile = {
    impulsesPerRevolution: 3,
    flywheelInertia: 0.073,
    sprocketRadius: 1.5,
    concept2MagicNumber: 2.8,

    // sensor signal filter settings
    rotationDebounceTimeMin: 7,
    rowingStoppedThresholdPeriod: 7,

    // drag factor filter settings
    goodnessOfFitThreshold: 0.97,
    maxDragFactorRecoveryPeriod: 6,
    lowerDragFactorThreshold: 75,
    upperDragFactorThreshold: 250,
    dragCoefficientsArrayLength: 1,

    // stroke phase detection filter settings
    strokeDetectionType: StrokeDetectionType.Torque,
    minimumPoweredTorque: 0,
    minimumDragTorque: 0,
    minimumRecoverySlopeMargin: 0.00001,
    minimumRecoverySlope: 0.01,
    minimumRecoveryTime: 300,
    minimumDriveTime: 300,
    impulseDataArrayLength: 7,
};

const rowerProfileManagerService: RowingProfileManagerService = {
    profile: signal(RowingProfile).asReadonly(),
} as RowingProfileManagerService;

fdescribe("StrokeService", (): void => {
    it("should have correct settings for test", (): void => {
        expect(RowingProfile.impulsesPerRevolution).toEqual(3);
        expect(RowingProfile.impulseDataArrayLength).toEqual(7);
        expect(RowingProfile.flywheelInertia).toEqual(0.073);
        expect(RowingProfile.dragCoefficientsArrayLength).toEqual(1);
        expect(RowingProfile.goodnessOfFitThreshold).toEqual(0.97);
        expect(RowingProfile.rotationDebounceTimeMin).toEqual(7);
        expect(RowingProfile.sprocketRadius).toEqual(1.5);
        expect(RowingProfile.minimumDriveTime).toEqual(300);
        expect(RowingProfile.minimumRecoveryTime).toEqual(300);
    });

    it("should load test data correctly", (): void => {
        expect(deltaTimes.length).toBeGreaterThan(0);
        expect(slopes.length).toBeGreaterThan(0);
        expect(torques.length).toBeGreaterThan(0);
        expect(forceCurves.length).toBeGreaterThan(0);
        expect(dragFactors.length).toBeGreaterThan(0);
    });

    describe("processData method should correctly determine", (): void => {
        const angularDisplacementPerImpulse = (2 * Math.PI) / 3;

        it("force curves and drag factor", (): void => {
            const strokeService = new StrokeService(rowerProfileManagerService.profile());

            let rawImpulseCount = 0;
            let totalTime = 0;
            let totalAngularDisplacement = 0.0;
            let rowingMetrics: IRowingMetrics = {} as IRowingMetrics;

            deltaTimes.forEach((deltaTime: number): void => {
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

                const prevStrokeCount = rowingMetrics.strokeCount;
                rowingMetrics = strokeService.getData();

                if (rowingMetrics.strokeCount > prevStrokeCount) {
                    const strokeIndex = rowingMetrics.strokeCount - 1;
                    rowingMetrics.driveHandleForces.forEach((force: number, index: number): void => {
                        expect(force)
                            .withContext(
                                `deltaTime: ${deltaTime}, strokeNumber: ${rowingMetrics.strokeCount}`,
                            )
                            .toBeCloseTo(forceCurves[strokeIndex][index], 4);
                    });

                    expect(rowingMetrics.dragCoefficient * 1e6)
                        .withContext(`deltaTime: ${deltaTime}, strokeNumber: ${rowingMetrics.strokeCount}`)
                        .toBeCloseTo(dragFactors[strokeIndex], 5);
                }
            });
        });

        it("total rowing metrics", (): void => {
            const strokeService = new StrokeService(rowerProfileManagerService.profile());

            let rawImpulseCount = 0;
            let totalTime = 0;
            let totalAngularDisplacement = 0.0;
            let rowingMetrics: IRowingMetrics = {} as IRowingMetrics;

            deltaTimes.forEach((deltaTime: number): void => {
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

                rowingMetrics = strokeService.getData();
            });

            expect(rowingMetrics.strokeCount).withContext("strokeCount").toEqual(10);
            expect(rowingMetrics.lastStrokeTime).withContext("lastStrokeTime").toEqual(32573215);
            const expectedDistance = 9290.9570160674;
            expect(rowingMetrics.distance).withContext("distance").toBeCloseTo(expectedDistance, 4);
            expect(rowingMetrics.lastRevTime).withContext("lastRevTime").toEqual(39577207);
        });
    });
});
