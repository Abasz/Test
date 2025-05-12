import {
    CyclePhase,
    IFlywheelData,
    IRowingMetrics,
    IRowingProfile,
    StrokeDetectionType,
} from "./calibration.interfaces";
import { OLSLinearSeries } from "./series/ols-linear.series";
import { TSLinearSeries } from "./series/ts-linear.series";
import { TSQuadraticSeries } from "./series/ts-quadratic.series";
import { WeightedAverageSeries } from "./series/weight-average.series";

export class StrokeService {
    private angularAccelerationMatrix: Array<WeightedAverageSeries> = [];
    private angularDisplacementPerImpulse!: number;
    private angularDistances!: TSQuadraticSeries;
    private angularVelocityMatrix: Array<WeightedAverageSeries> = [];
    private avgStrokePower: number = 0;
    private currentAngularAcceleration: number = 0;
    private currentAngularVelocity: number = 0;
    private currentTorque: number = 0;
    private cyclePhase: CyclePhase = CyclePhase.Stopped;
    private deltaTimes!: TSLinearSeries;
    private deltaTimesSlopes!: OLSLinearSeries;
    private distance: number = 0;
    private distancePerAngularDisplacement: number = 0;
    private dragCoefficient: number = 0;
    private dragCoefficients!: WeightedAverageSeries;
    private driveDuration: number = 0;
    private driveHandleForces: Array<number> = [];
    private driveStartAngularDisplacement: number = 0;
    private driveStartTime: number = 0;
    private driveTotalAngularDisplacement: number = 0;
    private marginDetectCount: number = 0;
    private recoveryDeltaTimes: OLSLinearSeries = new OLSLinearSeries();
    private recoveryDuration: number = 0;
    private recoveryStartAngularDisplacement: number = 0;
    private recoveryStartDistance: number = 0;
    private recoveryStartTime: number = 0;
    private recoveryTotalAngularDisplacement: number = 0;
    private revTime: number = 0;
    private rowingImpulseCount: number = 0;
    private rowingTotalAngularDisplacement: number = 0;
    private rowingTotalTime: number = 0;
    private strokeCount: number = 0;
    private strokeTime: number = 0;

    constructor(private rowingProfileConfiguration: IRowingProfile) {
        this.reset();

        this.deltaTimes.push(0, 0);
        this.angularDistances.push(0, 0);
    }

    getData(): IRowingMetrics {
        return {
            distance: this.distance,
            lastRevTime: this.revTime,
            lastStrokeTime: this.strokeTime,
            strokeCount: this.strokeCount,
            driveDuration: this.driveDuration,
            recoveryDuration: this.recoveryDuration,
            avgStrokePower: this.avgStrokePower,
            dragCoefficient: this.dragCoefficient,
            driveHandleForces: this.driveHandleForces,
        };
    }

    getMarginDetectCount(): number {
        return this.marginDetectCount;
    }

    processData(data: IFlywheelData): void {
        this.deltaTimes.push(data.totalTime, data.deltaTime);
        this.angularDistances.push(data.totalTime / 1e6, data.totalAngularDisplacement);

        if (this.angularVelocityMatrix.length >= this.rowingProfileConfiguration.impulseDataArrayLength) {
            this.angularVelocityMatrix.shift();
        }
        if (this.angularAccelerationMatrix.length >= this.rowingProfileConfiguration.impulseDataArrayLength) {
            this.angularAccelerationMatrix.shift();
        }

        this.angularVelocityMatrix.push(
            new WeightedAverageSeries(this.rowingProfileConfiguration.impulseDataArrayLength),
        );
        this.angularAccelerationMatrix.push(
            new WeightedAverageSeries(this.rowingProfileConfiguration.impulseDataArrayLength),
        );

        const angularGoodnessOfFit = this.angularDistances.goodnessOfFit();
        for (let i = 0; i < this.angularVelocityMatrix.length; i++) {
            this.angularVelocityMatrix[i].push(
                this.angularDistances.firstDerivativeAtPosition(i),
                angularGoodnessOfFit,
            );
            this.angularAccelerationMatrix[i].push(
                this.angularDistances.secondDerivativeAtPosition(i),
                angularGoodnessOfFit,
            );
        }

        this.currentAngularVelocity = this.angularVelocityMatrix[0].average();
        this.currentAngularAcceleration = this.angularAccelerationMatrix[0].average();

        this.currentTorque =
            this.rowingProfileConfiguration.flywheelInertia * this.currentAngularAcceleration +
            this.dragCoefficient * Math.pow(this.currentAngularVelocity, 2);

        if (
            this.cyclePhase === CyclePhase.Recovery &&
            this.rowingTotalTime - this.recoveryStartTime >
                this.rowingProfileConfiguration.rowingStoppedThresholdPeriod
        ) {
            this.driveHandleForces = [];
            this.recoveryEnd();
            this.cyclePhase = CyclePhase.Stopped;
            this.driveDuration = 0;
            this.avgStrokePower = 0;

            return;
        }

        if (this.cyclePhase === CyclePhase.Stopped) {
            if (
                this.deltaTimes.size() < this.rowingProfileConfiguration.impulseDataArrayLength ||
                !this.isFlywheelPowered()
            ) {
                return;
            }

            this.rowingImpulseCount++;
            this.rowingTotalTime += this.deltaTimes.yAtSeriesBegin();
            this.revTime = this.rowingTotalTime;
            this.rowingTotalAngularDisplacement += this.angularDisplacementPerImpulse;

            this.driveStart();

            return;
        }

        this.rowingImpulseCount++;
        this.rowingTotalTime += this.deltaTimes.yAtSeriesBegin();
        this.rowingTotalAngularDisplacement += this.angularDisplacementPerImpulse;

        this.distance +=
            this.distancePerAngularDisplacement *
            (this.distance === 0 ? this.rowingTotalAngularDisplacement : this.angularDisplacementPerImpulse);
        if (this.distance > 0) {
            this.revTime = this.rowingTotalTime;
        }

        if (this.cyclePhase === CyclePhase.Drive) {
            if (
                this.rowingTotalTime - this.driveStartTime >
                    this.rowingProfileConfiguration.minimumDriveTime &&
                this.isFlywheelUnpowered()
            ) {
                this.driveEnd();
                this.recoveryStart();

                return;
            }
            this.driveUpdate();

            return;
        }

        if (this.cyclePhase === CyclePhase.Recovery) {
            if (
                this.rowingTotalTime - this.recoveryStartTime >
                    this.rowingProfileConfiguration.minimumRecoveryTime &&
                this.isFlywheelPowered()
            ) {
                this.recoveryEnd();
                this.driveStart();

                return;
            }
            this.recoveryUpdate();

            return;
        }
    }

    reset(): void {
        this.rowingProfileConfiguration = {
            ...this.rowingProfileConfiguration,
            sprocketRadius: this.rowingProfileConfiguration.sprocketRadius / 100,
            rotationDebounceTimeMin: this.rowingProfileConfiguration.rotationDebounceTimeMin * 1_000,
            rowingStoppedThresholdPeriod: this.rowingProfileConfiguration.rowingStoppedThresholdPeriod * 1e6,
            maxDragFactorRecoveryPeriod: this.rowingProfileConfiguration.maxDragFactorRecoveryPeriod * 1e6,
            lowerDragFactorThreshold: this.rowingProfileConfiguration.lowerDragFactorThreshold / 1e6,
            upperDragFactorThreshold: this.rowingProfileConfiguration.upperDragFactorThreshold / 1e6,
            minimumRecoverySlopeMargin: this.rowingProfileConfiguration.minimumRecoverySlopeMargin / 1e6,
            minimumRecoveryTime: this.rowingProfileConfiguration.minimumRecoveryTime * 1_000,
            minimumDriveTime: this.rowingProfileConfiguration.minimumDriveTime * 1_000,
        };

        this.angularAccelerationMatrix = [];
        this.angularDisplacementPerImpulse =
            (2 * Math.PI) / this.rowingProfileConfiguration.impulsesPerRevolution;
        this.angularDistances = new TSQuadraticSeries(this.rowingProfileConfiguration.impulseDataArrayLength);
        this.angularVelocityMatrix = [];
        this.avgStrokePower = 0;
        this.currentAngularAcceleration = 0;
        this.currentAngularVelocity = 0;
        this.currentTorque = 0;
        this.cyclePhase = CyclePhase.Stopped;
        this.deltaTimes = new TSLinearSeries(this.rowingProfileConfiguration.impulseDataArrayLength);
        this.deltaTimesSlopes = new OLSLinearSeries(this.rowingProfileConfiguration.impulseDataArrayLength);
        this.distance = 0;
        this.distancePerAngularDisplacement = 0;
        this.dragCoefficient = 0;
        this.dragCoefficients = new WeightedAverageSeries(
            this.rowingProfileConfiguration.dragCoefficientsArrayLength,
        );
        this.driveDuration = 0;
        this.driveHandleForces = [];
        this.driveStartAngularDisplacement = 0;
        this.driveStartTime = 0;
        this.driveTotalAngularDisplacement = 0;
        this.recoveryDeltaTimes = new OLSLinearSeries();
        this.recoveryDuration = 0;
        this.recoveryStartAngularDisplacement = 0;
        this.recoveryStartDistance = 0;
        this.recoveryStartTime = 0;
        this.recoveryTotalAngularDisplacement = 0;
        this.revTime = 0;
        this.rowingImpulseCount = 0;
        this.rowingTotalAngularDisplacement = 0;
        this.rowingTotalTime = 0;
        this.strokeCount = 0;
        this.strokeTime = 0;
    }

    private calculateAvgStrokePower(): void {
        this.avgStrokePower =
            this.dragCoefficient *
            Math.pow(
                (this.recoveryTotalAngularDisplacement + this.driveTotalAngularDisplacement) /
                    ((this.driveDuration + this.recoveryDuration) / 1e6),
                3,
            );
    }

    private calculateDragCoefficient(): void {
        if (
            this.recoveryDuration > this.rowingProfileConfiguration.maxDragFactorRecoveryPeriod ||
            this.recoveryDeltaTimes.size() < this.rowingProfileConfiguration.impulseDataArrayLength
        ) {
            return;
        }

        const goodnessOfFit = this.recoveryDeltaTimes.goodnessOfFit();

        if (goodnessOfFit < this.rowingProfileConfiguration.goodnessOfFitThreshold) {
            return;
        }

        const rawNewDragCoefficient =
            (this.recoveryDeltaTimes.slope() * this.rowingProfileConfiguration.flywheelInertia) /
            this.angularDisplacementPerImpulse;

        if (
            rawNewDragCoefficient > this.rowingProfileConfiguration.upperDragFactorThreshold ||
            rawNewDragCoefficient < this.rowingProfileConfiguration.lowerDragFactorThreshold
        ) {
            return;
        }

        if (this.rowingProfileConfiguration.dragCoefficientsArrayLength < 2) {
            this.dragCoefficient = rawNewDragCoefficient;

            return;
        }

        this.dragCoefficients.push(rawNewDragCoefficient, goodnessOfFit);
        this.dragCoefficient = this.dragCoefficients.average();
    }

    private driveEnd(): void {
        this.driveDuration = this.rowingTotalTime - this.driveStartTime;
        this.driveTotalAngularDisplacement =
            this.rowingTotalAngularDisplacement - this.driveStartAngularDisplacement;
        this.strokeCount++;
        this.strokeTime = this.rowingTotalTime;
    }

    private driveStart(): void {
        this.cyclePhase = CyclePhase.Drive;
        this.driveStartTime = this.rowingTotalTime;
        this.driveStartAngularDisplacement = this.rowingTotalAngularDisplacement;
        this.driveHandleForces = [this.currentTorque / this.rowingProfileConfiguration.sprocketRadius];

        if (this.rowingProfileConfiguration.strokeDetectionType !== StrokeDetectionType.Slope) {
            this.deltaTimesSlopes.reset();
            this.deltaTimesSlopes.push(this.rowingTotalTime, this.deltaTimes.coefficientA());
        }
    }

    private driveUpdate(): void {
        if (this.driveHandleForces.length >= 0xff) {
            this.driveEnd();
            if (this.rowingProfileConfiguration.strokeDetectionType !== StrokeDetectionType.Slope) {
                this.dragCoefficient = 0;
                this.dragCoefficients.reset();
            }
            this.recoveryStart();
            console.warn(
                "driveHandleForces variable data point size exceeded max capacity. Resetting variable to avoid crash...",
            );

            return;
        }

        this.driveHandleForces.push(this.currentTorque / this.rowingProfileConfiguration.sprocketRadius);

        if (this.rowingProfileConfiguration.strokeDetectionType !== StrokeDetectionType.Slope) {
            this.deltaTimesSlopes.push(this.rowingTotalTime, this.deltaTimes.coefficientA());
        }
    }

    private isFlywheelPowered(): boolean {
        return (
            this.currentTorque > this.rowingProfileConfiguration.minimumPoweredTorque &&
            this.deltaTimes.coefficientA() < 0
        );
    }

    private isFlywheelUnpowered(): boolean {
        if (
            this.rowingProfileConfiguration.strokeDetectionType !== StrokeDetectionType.Slope &&
            this.deltaTimesSlopes.size() >= this.rowingProfileConfiguration.impulseDataArrayLength
        ) {
            if (
                this.currentTorque < this.rowingProfileConfiguration.minimumDragTorque &&
                this.deltaTimes.coefficientA() > 0
            ) {
                return true;
            }

            if (
                Math.abs(this.deltaTimesSlopes.slope()) <
                this.rowingProfileConfiguration.minimumRecoverySlopeMargin
            ) {
                this.marginDetectCount++;

                return true;
            }
        }

        if (
            this.rowingProfileConfiguration.strokeDetectionType !== StrokeDetectionType.Torque &&
            this.deltaTimes.coefficientA() > this.rowingProfileConfiguration.minimumRecoverySlope
        ) {
            return true;
        }

        return false;
    }

    private recoveryEnd(): void {
        this.recoveryDuration = this.rowingTotalTime - this.recoveryStartTime;

        this.recoveryTotalAngularDisplacement =
            this.rowingTotalAngularDisplacement - this.recoveryStartAngularDisplacement;
        this.calculateDragCoefficient();

        this.recoveryDeltaTimes.reset();
        this.calculateAvgStrokePower();

        this.distancePerAngularDisplacement = Math.pow(
            (this.dragCoefficient * 1e6) / this.rowingProfileConfiguration.concept2MagicNumber,
            1 / 3.0,
        );
        this.distance =
            this.recoveryStartDistance +
            this.distancePerAngularDisplacement *
                (this.distance === 0
                    ? this.rowingTotalAngularDisplacement
                    : this.recoveryTotalAngularDisplacement);
        if (this.distance > 0) {
            this.revTime = this.rowingTotalTime;
        }
    }

    private recoveryStart(): void {
        this.cyclePhase = CyclePhase.Recovery;
        this.recoveryStartTime = this.rowingTotalTime;
        this.recoveryStartAngularDisplacement = this.rowingTotalAngularDisplacement;
        this.recoveryStartDistance = this.distance;
        this.recoveryDeltaTimes.push(this.rowingTotalTime, this.deltaTimes.yAtSeriesBegin());
    }

    private recoveryUpdate(): void {
        if (
            this.rowingTotalTime - this.recoveryStartTime <
            this.rowingProfileConfiguration.maxDragFactorRecoveryPeriod
        ) {
            this.recoveryDeltaTimes.push(this.rowingTotalTime, this.deltaTimes.yAtSeriesBegin());
        }
    }
}
