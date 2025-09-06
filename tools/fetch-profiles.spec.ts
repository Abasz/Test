import {
    extractDeviceInfo,
    generateProfileKey,
    extractValue,
    extractStrokeDetectionType,
    parseProfileHeader,
} from "./fetch-profiles";

const TEST_PROFILES = {
    concept2ModelD: `
#ifndef GENERIC_ROWER_PROFILE_H
#define GENERIC_ROWER_PROFILE_H

#define DEVICE_NAME Concept2
#define MODEL_NUMBER "Model D"

// Machine settings
#define FLYWHEEL_INERTIA 0.07848
#define CONCEPT_2_MAGIC_NUMBER 2.8
#define SPROCKET_RADIUS 1.5
#define IMPULSES_PER_REVOLUTION 3

// Sensor signal settings
#define ROTATION_DEBOUNCE_TIME_MIN 7
#define ROWING_STOPPED_THRESHOLD_PERIOD 7

// Drag factor settings
#define GOODNESS_OF_FIT_THRESHOLD 0.97
#define MAX_DRAG_FACTOR_RECOVERY_PERIOD 6
#define LOWER_DRAG_FACTOR_THRESHOLD 75
#define UPPER_DRAG_FACTOR_THRESHOLD 250
#define DRAG_COEFFICIENTS_ARRAY_LENGTH 1

// Stroke detection settings
#define STROKE_DETECTION_TORQUE
#define IMPULSE_DATA_ARRAY_LENGTH 180
#define MINIMUM_POWERED_TORQUE 0.05
#define MINIMUM_DRAG_TORQUE 0.15
#define MINIMUM_RECOVERY_SLOPE_MARGIN 15
#define MINIMUM_RECOVERY_SLOPE -35
#define MINIMUM_RECOVERY_TIME 900
#define MINIMUM_DRIVE_TIME 300
#define DRIVE_HANDLE_FORCES_MAX_CAPACITY 255

#endif
`,
    kayakFirstOrange: `
#define DEVICE_NAME KayakFirst
#define MODEL_NUMBER "Orange"
#define FLYWHEEL_INERTIA 0.0625
#define CONCEPT_2_MAGIC_NUMBER 2.75
#define SPROCKET_RADIUS 1.4
#define IMPULSES_PER_REVOLUTION 1
#define ROTATION_DEBOUNCE_TIME_MIN 6
#define ROWING_STOPPED_THRESHOLD_PERIOD 6
#define GOODNESS_OF_FIT_THRESHOLD 0.98
#define MAX_DRAG_FACTOR_RECOVERY_PERIOD 5
#define LOWER_DRAG_FACTOR_THRESHOLD 80
#define UPPER_DRAG_FACTOR_THRESHOLD 300
#define DRAG_COEFFICIENTS_ARRAY_LENGTH 2
#define STROKE_DETECTION_SLOPE
#define IMPULSE_DATA_ARRAY_LENGTH 200
#define MINIMUM_POWERED_TORQUE 0.08
#define MINIMUM_DRAG_TORQUE 0.18
#define MINIMUM_RECOVERY_SLOPE_MARGIN 20
#define MINIMUM_RECOVERY_SLOPE -40
#define MINIMUM_RECOVERY_TIME 1000
#define MINIMUM_DRIVE_TIME 350
`,
    waterRowerS4: `
#define DEVICE_NAME WaterRower
#define MODEL_NUMBER "S4 Performance Monitor"
#define FLYWHEEL_INERTIA 0.09
#define CONCEPT_2_MAGIC_NUMBER 3.1
#define SPROCKET_RADIUS 1.6
#define IMPULSES_PER_REVOLUTION 4
#define ROTATION_DEBOUNCE_TIME_MIN 8
#define ROWING_STOPPED_THRESHOLD_PERIOD 8
#define GOODNESS_OF_FIT_THRESHOLD 0.96
#define MAX_DRAG_FACTOR_RECOVERY_PERIOD 8
#define LOWER_DRAG_FACTOR_THRESHOLD 85
#define UPPER_DRAG_FACTOR_THRESHOLD 320
#define DRAG_COEFFICIENTS_ARRAY_LENGTH 4
#define STROKE_DETECTION_TORQUE
#define IMPULSE_DATA_ARRAY_LENGTH 220
#define MINIMUM_POWERED_TORQUE 0.07
#define MINIMUM_DRAG_TORQUE 0.2
#define MINIMUM_RECOVERY_SLOPE_MARGIN 18
#define MINIMUM_RECOVERY_SLOPE -38
#define MINIMUM_RECOVERY_TIME 950
#define MINIMUM_DRIVE_TIME 320
`,
    ergDataPlus: `
#define DEVICE_NAME ErgData
#define MODEL_NUMBER Plus 5 ergData
#define FLYWHEEL_INERTIA 0.065
#define CONCEPT_2_MAGIC_NUMBER 2.7
#define SPROCKET_RADIUS 1.35
#define IMPULSES_PER_REVOLUTION 2
#define ROTATION_DEBOUNCE_TIME_MIN 6
#define ROWING_STOPPED_THRESHOLD_PERIOD 6
#define GOODNESS_OF_FIT_THRESHOLD 0.94
#define MAX_DRAG_FACTOR_RECOVERY_PERIOD 5
#define LOWER_DRAG_FACTOR_THRESHOLD 78
#define UPPER_DRAG_FACTOR_THRESHOLD 290
#define DRAG_COEFFICIENTS_ARRAY_LENGTH 2
#define STROKE_DETECTION_SLOPE
#define IMPULSE_DATA_ARRAY_LENGTH 190
#define MINIMUM_POWERED_TORQUE 0.055
#define MINIMUM_DRAG_TORQUE 0.16
#define MINIMUM_RECOVERY_SLOPE_MARGIN 16
#define MINIMUM_RECOVERY_SLOPE -36
#define MINIMUM_RECOVERY_TIME 880
#define MINIMUM_DRIVE_TIME 290
`,
};

describe("fetch-profiles", (): void => {
    describe("extractDeviceInfo", (): void => {
        it("should extract device name and model number with quotes", (): void => {
            const result = extractDeviceInfo(TEST_PROFILES.concept2ModelD);
            expect(result.deviceName).toBe("Concept2");
            expect(result.modelNumber).toBe("Model D");
        });

        it("should extract device name and model number without quotes", (): void => {
            const result = extractDeviceInfo(TEST_PROFILES.ergDataPlus);
            expect(result.deviceName).toBe("ErgData");
            expect(result.modelNumber).toBe("Plus 5 ergData");
        });

        it("should handle complex model numbers with spaces", (): void => {
            const result = extractDeviceInfo(TEST_PROFILES.waterRowerS4);
            expect(result.deviceName).toBe("WaterRower");
            expect(result.modelNumber).toBe("S4 Performance Monitor");
        });

        it("should throw error when device name is missing", (): void => {
            const invalidContent = `#define MODEL_NUMBER "Test"`;
            expect((): void => {
                extractDeviceInfo(invalidContent);
            }).toThrowError(/Failed to parse device name or model number/);
        });

        it("should throw error when model number is missing", (): void => {
            const invalidContent = `#define DEVICE_NAME TestDevice`;
            expect((): void => {
                extractDeviceInfo(invalidContent);
            }).toThrowError(/Failed to parse device name or model number/);
        });

        it("should handle various whitespace patterns", (): void => {
            const content = `
                #define   DEVICE_NAME    TestDevice
                #define	MODEL_NUMBER	  "Test Model"
            `;
            const result = extractDeviceInfo(content);
            expect(result.deviceName).toBe("TestDevice");
            expect(result.modelNumber).toBe("Test Model");
        });
    });

    describe("generateProfileKey", (): void => {
        it("should generate correct camelCase key for Concept2 Model D", (): void => {
            const key = generateProfileKey("Concept2", "Model D");
            expect(key).toBe("concept2ModelD");
        });

        it("should generate correct camelCase key for KayakFirst Orange", (): void => {
            const key = generateProfileKey("KayakFirst", "Orange");
            expect(key).toBe("kayakFirstOrange");
        });

        it("should handle complex model names with multiple words", (): void => {
            const key = generateProfileKey("WaterRower", "S4 Performance Monitor");
            expect(key).toBe("waterRowerS4PerformanceMonitor");
        });

        it("should handle model names with special characters", (): void => {
            const key = generateProfileKey("TestDevice", "Model-X_Pro");
            expect(key).toBe("testDeviceModelXPro");
        });

        it("should handle model names with hyphens and underscores", (): void => {
            const key = generateProfileKey("TestDevice", "Model-X_Pro");
            expect(key).toBe("testDeviceModelXPro");
        });

        it("should handle empty model number", (): void => {
            const key = generateProfileKey("TestDevice", "");
            expect(key).toBe("testDevice");
        });

        it("should handle device names with numbers", (): void => {
            const key = generateProfileKey("Device123", "Model456");
            expect(key).toBe("device123Model456");
        });

        it("should handle lowercase device names", (): void => {
            const key = generateProfileKey("testdevice", "model name");
            expect(key).toBe("testdeviceModelName");
        });
    });

    describe("extractValue", (): void => {
        it("should extract integer values correctly", (): void => {
            const content = "#define IMPULSES_PER_REVOLUTION 3";
            const result = extractValue(content, "IMPULSES_PER_REVOLUTION");
            expect(result).toBe(3);
        });

        it("should extract decimal values correctly", (): void => {
            const content = "#define FLYWHEEL_INERTIA 0.07848";
            const result = extractValue(content, "FLYWHEEL_INERTIA");
            expect(result).toBe(0.07848);
        });

        it("should extract values with various whitespace patterns", (): void => {
            const content = "#define   SPROCKET_RADIUS   1.5";
            const result = extractValue(content, "SPROCKET_RADIUS");
            expect(result).toBe(1.5);
        });

        it("should return default value when define is missing", (): void => {
            const content = "#define OTHER_VALUE 123";
            const result = extractValue(content, "MISSING_VALUE", 255);
            expect(result).toBe(255);
        });

        it("should throw error when define is missing and no default", (): void => {
            const content = "#define OTHER_VALUE 123";
            expect((): void => {
                extractValue(content, "MISSING_VALUE");
            }).toThrowError(/Required #define MISSING_VALUE was not found/);
        });

        it("should handle negative values", (): void => {
            const content = "#define NEGATIVE_VALUE -35.5";
            const result = extractValue(content, "NEGATIVE_VALUE");
            expect(result).toBe(-35.5);
        });

        it("should handle scientific notation", (): void => {
            const content = "#define SCIENTIFIC_VALUE 1.23e-4";
            const result = extractValue(content, "SCIENTIFIC_VALUE");
            expect(result).toBe(0.000123);
        });

        it("should handle values with trailing comments", (): void => {
            const content = "#define FLYWHEEL_INERTIA 0.07848  // This is the flywheel inertia";
            const result = extractValue(content, "FLYWHEEL_INERTIA");
            expect(result).toBe(0.07848);
        });
    });

    describe("extractStrokeDetectionType", (): void => {
        it("should return 0 for STROKE_DETECTION_TORQUE", (): void => {
            const content = "#define STROKE_DETECTION_TORQUE";
            const result = extractStrokeDetectionType(content);
            expect(result).toBe(0);
        });

        it("should return 1 for STROKE_DETECTION_SLOPE", (): void => {
            const content = "#define STROKE_DETECTION_SLOPE";
            const result = extractStrokeDetectionType(content);
            expect(result).toBe(1);
        });

        it("should return 2 for STROKE_DETECTION_BOTH", (): void => {
            const content = "#define STROKE_DETECTION_BOTH";
            const result = extractStrokeDetectionType(content);
            expect(result).toBe(2);
        });

        it("should return 0 when no stroke detection type is defined", (): void => {
            const content = "#define OTHER_DEFINE value";
            const result = extractStrokeDetectionType(content);
            expect(result).toBe(0);
        });

        it("should prioritize SLOPE over BOTH when both are present", (): void => {
            const content = `
                #define STROKE_DETECTION_SLOPE
                #define STROKE_DETECTION_BOTH
            `;
            const result = extractStrokeDetectionType(content);
            expect(result).toBe(1);
        });
    });

    describe("parseProfileHeader", (): void => {
        it("should parse Concept2 Model D profile correctly", (): void => {
            const result = parseProfileHeader(TEST_PROFILES.concept2ModelD);

            expect(result.name).toBe("Concept2 Model D");
            expect(result.settings.machineSettings.flywheelInertia).toBe(0.07848);
            expect(result.settings.machineSettings.magicConstant).toBe(2.8);
            expect(result.settings.machineSettings.sprocketRadius).toBe(1.5);
            expect(result.settings.machineSettings.impulsePerRevolution).toBe(3);

            expect(result.settings.sensorSignalSettings.rotationDebounceTime).toBe(7);
            expect(result.settings.sensorSignalSettings.rowingStoppedThreshold).toBe(7);

            expect(result.settings.dragFactorSettings.goodnessOfFitThreshold).toBe(0.97);
            expect(result.settings.dragFactorSettings.maxDragFactorRecoveryPeriod).toBe(6);
            expect(result.settings.dragFactorSettings.dragFactorLowerThreshold).toBe(75);
            expect(result.settings.dragFactorSettings.dragFactorUpperThreshold).toBe(250);
            expect(result.settings.dragFactorSettings.dragCoefficientsArrayLength).toBe(1);

            expect(result.settings.strokeDetectionSettings.strokeDetectionType).toBe(0);
            expect(result.settings.strokeDetectionSettings.impulseDataArrayLength).toBe(180);
            expect(result.settings.strokeDetectionSettings.minimumPoweredTorque).toBe(0.05);
            expect(result.settings.strokeDetectionSettings.minimumDragTorque).toBe(0.15);
            expect(result.settings.strokeDetectionSettings.minimumRecoverySlopeMargin).toBe(15);
            expect(result.settings.strokeDetectionSettings.minimumRecoverySlope).toBe(-35);
            expect(result.settings.strokeDetectionSettings.minimumRecoveryTime).toBe(900);
            expect(result.settings.strokeDetectionSettings.minimumDriveTime).toBe(300);
            expect(result.settings.strokeDetectionSettings.driveHandleForcesMaxCapacity).toBe(255);
        });

        it("should parse KayakFirst Orange profile correctly", (): void => {
            const result = parseProfileHeader(TEST_PROFILES.kayakFirstOrange);

            expect(result.name).toBe("KayakFirst Orange");
            expect(result.settings.machineSettings.flywheelInertia).toBe(0.0625);
            expect(result.settings.strokeDetectionSettings.strokeDetectionType).toBe(1);
        });

        it("should parse WaterRower S4 profile correctly", (): void => {
            const result = parseProfileHeader(TEST_PROFILES.waterRowerS4);

            expect(result.name).toBe("WaterRower S4 Performance Monitor");
            expect(result.settings.machineSettings.flywheelInertia).toBe(0.09);
            expect(result.settings.machineSettings.impulsePerRevolution).toBe(4);
        });

        it("should parse ErgData Plus profile correctly (no quotes)", (): void => {
            const result = parseProfileHeader(TEST_PROFILES.ergDataPlus);

            expect(result.name).toBe("ErgData Plus 5 ergData");
            expect(result.settings.machineSettings.flywheelInertia).toBe(0.065);
        });

        it("should use default value for DRIVE_HANDLE_FORCES_MAX_CAPACITY when missing", (): void => {
            const contentWithoutCapacity = TEST_PROFILES.kayakFirstOrange.replace(
                "DRIVE_HANDLE_FORCES_MAX_CAPACITY",
                "COMMENTED_OUT_CAPACITY",
            );
            const result = parseProfileHeader(contentWithoutCapacity);

            expect(result.settings.strokeDetectionSettings.driveHandleForcesMaxCapacity).toBe(255);
        });

        it("should throw error when required machine setting is missing", (): void => {
            const invalidContent = TEST_PROFILES.concept2ModelD.replace(
                "FLYWHEEL_INERTIA",
                "MISSING_INERTIA",
            );

            expect((): void => {
                parseProfileHeader(invalidContent);
            }).toThrowError(/Required #define FLYWHEEL_INERTIA was not found/);
        });

        it("should throw error when required sensor setting is missing", (): void => {
            const invalidContent = TEST_PROFILES.concept2ModelD.replace(
                "ROTATION_DEBOUNCE_TIME_MIN",
                "MISSING_DEBOUNCE",
            );

            expect((): void => {
                parseProfileHeader(invalidContent);
            }).toThrowError(/Required #define ROTATION_DEBOUNCE_TIME_MIN was not found/);
        });

        it("should throw error when required drag factor setting is missing", (): void => {
            const invalidContent = TEST_PROFILES.concept2ModelD.replace(
                "GOODNESS_OF_FIT_THRESHOLD",
                "MISSING_THRESHOLD",
            );

            expect((): void => {
                parseProfileHeader(invalidContent);
            }).toThrowError(/Required #define GOODNESS_OF_FIT_THRESHOLD was not found/);
        });

        it("should throw error when required stroke detection setting is missing", (): void => {
            const invalidContent = TEST_PROFILES.concept2ModelD.replace(
                "IMPULSE_DATA_ARRAY_LENGTH",
                "MISSING_LENGTH",
            );

            expect((): void => {
                parseProfileHeader(invalidContent);
            }).toThrowError(/Required #define IMPULSE_DATA_ARRAY_LENGTH was not found/);
        });
    });

    describe("Integration tests", (): void => {
        it("should generate correct profile keys for all test profiles", (): void => {
            const testCases = [
                { content: TEST_PROFILES.concept2ModelD, expectedKey: "concept2ModelD" },
                { content: TEST_PROFILES.kayakFirstOrange, expectedKey: "kayakFirstOrange" },
                { content: TEST_PROFILES.waterRowerS4, expectedKey: "waterRowerS4PerformanceMonitor" },
                { content: TEST_PROFILES.ergDataPlus, expectedKey: "ergDataPlus5ErgData" },
            ];

            testCases.forEach(({ content, expectedKey }: { content: string; expectedKey: string }): void => {
                const deviceInfo = extractDeviceInfo(content);
                const profileKey = generateProfileKey(deviceInfo.deviceName, deviceInfo.modelNumber);
                expect(profileKey).toBe(expectedKey);
            });
        });

        it("should parse all test profiles without throwing errors", (): void => {
            const testCases = [
                { content: TEST_PROFILES.concept2ModelD, filename: "concept2.h" },
                { content: TEST_PROFILES.kayakFirstOrange, filename: "kayakfirst.h" },
                { content: TEST_PROFILES.waterRowerS4, filename: "waterrower.h" },
                { content: TEST_PROFILES.ergDataPlus, filename: "ergdata.h" },
            ];

            testCases.forEach(({ content, filename }: { content: string; filename: string }): void => {
                expect((): void => {
                    parseProfileHeader(content);
                }).not.toThrow();

                const result = parseProfileHeader(content);
                expect(result.name).toBeTruthy();
                expect(result.settings).toBeTruthy();
                expect(result.settings.machineSettings).toBeTruthy();
                expect(result.settings.sensorSignalSettings).toBeTruthy();
                expect(result.settings.dragFactorSettings).toBeTruthy();
                expect(result.settings.strokeDetectionSettings).toBeTruthy();
            });
        });

        it("should validate all parsed values are numbers and within expected ranges", (): void => {
            const result = parseProfileHeader(TEST_PROFILES.concept2ModelD);

            // machine settings should all be positive numbers
            expect(result.settings.machineSettings.flywheelInertia).toBeGreaterThan(0);
            expect(result.settings.machineSettings.magicConstant).toBeGreaterThan(0);
            expect(result.settings.machineSettings.sprocketRadius).toBeGreaterThan(0);
            expect(result.settings.machineSettings.impulsePerRevolution).toBeGreaterThan(0);

            // sensor settings should be positive
            expect(result.settings.sensorSignalSettings.rotationDebounceTime).toBeGreaterThan(0);
            expect(result.settings.sensorSignalSettings.rowingStoppedThreshold).toBeGreaterThan(0);

            // drag factor settings should be within reasonable ranges
            expect(result.settings.dragFactorSettings.goodnessOfFitThreshold).toBeGreaterThan(0);
            expect(result.settings.dragFactorSettings.goodnessOfFitThreshold).toBeLessThanOrEqual(1);
            expect(result.settings.dragFactorSettings.dragFactorLowerThreshold).toBeGreaterThan(0);
            expect(result.settings.dragFactorSettings.dragFactorUpperThreshold).toBeGreaterThan(
                result.settings.dragFactorSettings.dragFactorLowerThreshold,
            );

            // stroke detection type should be 0, 1, or 2
            expect([0, 1, 2]).toContain(result.settings.strokeDetectionSettings.strokeDetectionType);
        });
    });
});
