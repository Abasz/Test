export interface ICalibrationRowingMetrics {
    deltaTimesLog: Array<number>;
    marginDetect: number;
    rowingMetrics: Array<IRowingMetrics>;
    minDeltaTimeChartValue: number | undefined;
}

export interface IFlywheelData {
    rawImpulseCount: number;
    deltaTime: number;
    totalTime: number;
    totalAngularDisplacement: number;
    cleanImpulseTime: number;
    rawImpulseTime: number;
}

export interface IRowingMetrics {
    distance: number;
    lastRevTime: number;
    lastStrokeTime: number;
    strokeCount: number;
    driveDuration: number;
    recoveryDuration: number;
    avgStrokePower: number;
    dragCoefficient: number;
    driveHandleForces: Array<number>;
}

export interface IPairWithIndex {
    value: number;
    index: number;
}

export interface ICalibrationTotals extends Omit<IRowingMetrics, "driveHandleForces"> {
    distance: number;
    lastRevTime: number;
    lastStrokeTime: number;
    strokeCount: number;
    driveDuration: number;
    recoveryDuration: number;
    avgStrokePower: number;
    dragCoefficient: number;
    driveHandleForcesMin: IPairWithIndex;
    driveHandleForcesMax: IPairWithIndex;
}

export enum CyclePhase {
    Stopped,
    Drive,
    Recovery,
}

export enum StrokeDetectionType {
    Torque,
    Slope,
    Both,
}

export interface IRowingProfile {
    impulsesPerRevolution: number;
    flywheelInertia: number;
    sprocketRadius: number;
    concept2MagicNumber: number;

    // sensor signal filter settings
    rotationDebounceTimeMin: number;
    rowingStoppedThresholdPeriod: number;

    // drag factor filter settings
    goodnessOfFitThreshold: number;
    maxDragFactorRecoveryPeriod: number;
    lowerDragFactorThreshold: number;
    upperDragFactorThreshold: number;
    dragCoefficientsArrayLength: number;

    // stroke phase detection filter settings
    strokeDetectionType: StrokeDetectionType;
    minimumPoweredTorque: number;
    minimumDragTorque: number;
    minimumRecoverySlopeMargin: number;
    minimumRecoverySlope: number;
    minimumRecoveryTime: number;
    minimumDriveTime: number;
    impulseDataArrayLength: number;
}
