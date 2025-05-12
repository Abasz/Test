import { IRowingProfile, StrokeDetectionType } from "./calibration.interfaces";

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
    minimumDragTorque: 0.14,
    minimumRecoverySlopeMargin: 0.00001,
    minimumRecoverySlope: 0.01,
    minimumRecoveryTime: 800,
    minimumDriveTime: 400,
    impulseDataArrayLength: 7,
};
