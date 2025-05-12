import {
    ChangeDetectionStrategy,
    Component,
    input,
    InputSignal,
    OnInit,
    OutputRef,
    Signal,
} from "@angular/core";
import { outputFromObservable, toSignal } from "@angular/core/rxjs-interop";
import {
    FormControl,
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatError, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { distinctUntilChanged, filter, map, startWith } from "rxjs";

import { IValidationErrors } from "../../../common/common.interfaces";
import { getValidationErrors } from "../../../common/utils/utility.functions";
import { IRowingProfile } from "../calibration.interfaces";

import { StrokeDetectionType } from "./../calibration.interfaces";

export type RowingProfileFormGroup = FormGroup<{
    [K in keyof IRowingProfile]: FormControl<IRowingProfile[K]>;
}>;

@Component({
    selector: "app-rowing-profile-editor",
    templateUrl: "./rowing-profile-editor.component.html",
    styleUrls: ["./rowing-profile-editor.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatLabel,
        MatError,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatSliderModule,
        MatExpansionModule,
    ],
})
export class RowingProfileEditorComponent implements OnInit {
    StrokeDetectionType: typeof StrokeDetectionType = StrokeDetectionType;

    rowingProfile: InputSignal<IRowingProfile> = input({} as IRowingProfile);

    rowingProfileForm: RowingProfileFormGroup = this.fb.group({
        concept2MagicNumber: [
            this.rowingProfile().concept2MagicNumber,
            [Validators.min(0), Validators.max(255 / 25)],
        ],
        dragCoefficientsArrayLength: [
            this.rowingProfile().dragCoefficientsArrayLength,
            [Validators.min(0), Validators.max(16)],
        ],
        flywheelInertia: [this.rowingProfile().flywheelInertia, [Validators.min(0), Validators.max(2)]],
        goodnessOfFitThreshold: [
            this.rowingProfile().goodnessOfFitThreshold,
            [Validators.min(0), Validators.max(1)],
        ],
        impulseDataArrayLength: [
            this.rowingProfile().impulseDataArrayLength,
            [Validators.min(3), Validators.max(15)],
        ],
        impulsesPerRevolution: [
            this.rowingProfile().impulsesPerRevolution,
            [Validators.min(0), Validators.max(10)],
        ],
        lowerDragFactorThreshold: [
            this.rowingProfile().lowerDragFactorThreshold,
            [Validators.min(0), Validators.max(0xffff)],
        ],
        maxDragFactorRecoveryPeriod: [
            this.rowingProfile().maxDragFactorRecoveryPeriod,
            [Validators.min(0), Validators.max(10)],
        ],
        minimumDragTorque: [this.rowingProfile().minimumDragTorque],
        minimumDriveTime: [this.rowingProfile().minimumDriveTime, [Validators.min(0), Validators.max(2040)]],
        minimumPoweredTorque: [this.rowingProfile().minimumPoweredTorque],
        minimumRecoverySlope: [
            {
                value: this.rowingProfile().minimumRecoverySlope,
                disabled: this.rowingProfile().strokeDetectionType === StrokeDetectionType.Torque,
            },
        ],
        minimumRecoverySlopeMargin: [
            {
                value: this.rowingProfile().minimumRecoverySlopeMargin,
                disabled: this.rowingProfile().strokeDetectionType === StrokeDetectionType.Slope,
            },
        ],
        minimumRecoveryTime: [
            this.rowingProfile().minimumRecoveryTime,
            [Validators.min(0), Validators.max(2040)],
        ],
        rotationDebounceTimeMin: [
            this.rowingProfile().rotationDebounceTimeMin,
            [Validators.min(0), Validators.max(15)],
        ],
        rowingStoppedThresholdPeriod: [
            this.rowingProfile().rowingStoppedThresholdPeriod,
            [Validators.min(0), Validators.max(15)],
        ],
        sprocketRadius: [this.rowingProfile().sprocketRadius, [Validators.min(0), Validators.max(5.1)]],
        strokeDetectionType: [this.rowingProfile().strokeDetectionType],
        upperDragFactorThreshold: [
            this.rowingProfile().upperDragFactorThreshold,
            [Validators.min(0), Validators.max(0xffff)],
        ],
    });

    rowingProfileFormErrors: Signal<ValidationErrors | null>;

    readonly settingsChanged: OutputRef<IRowingProfile> = outputFromObservable(
        this.rowingProfileForm.valueChanges.pipe(
            filter((): boolean => this.rowingProfileForm.valid),
            map((): IRowingProfile => this.rowingProfileForm.getRawValue()),
            distinctUntilChanged(
                (old: IRowingProfile, current: IRowingProfile): boolean =>
                    !(
                        Object.keys(this.rowingProfileForm.getRawValue()) as unknown as Array<
                            keyof IRowingProfile
                        >
                    )
                        .map((key: keyof IRowingProfile): boolean => old[key] === current[key])
                        .includes(false),
            ),
        ),
    );

    constructor(private fb: NonNullableFormBuilder) {
        this.rowingProfileFormErrors = toSignal(
            this.rowingProfileForm.statusChanges.pipe(
                startWith("INVALID"),
                map((): IValidationErrors => getValidationErrors(this.rowingProfileForm.controls)),
            ),
            { requireSync: true },
        );
    }

    formatThousands(value: number): string {
        if (value >= 10000) {
            return Math.round(value / 1000) + "k";
        }

        if (value >= 1000) {
            return Math.round((value / 1000) * 10) / 10 + "k";
        }

        return `${value}`;
    }

    ngOnInit(): void {
        this.rowingProfileForm.setValue({
            concept2MagicNumber: this.rowingProfile().concept2MagicNumber,
            dragCoefficientsArrayLength: this.rowingProfile().dragCoefficientsArrayLength,
            flywheelInertia: this.rowingProfile().flywheelInertia,
            goodnessOfFitThreshold: this.rowingProfile().goodnessOfFitThreshold,
            impulseDataArrayLength: this.rowingProfile().impulseDataArrayLength,
            impulsesPerRevolution: this.rowingProfile().impulsesPerRevolution,
            lowerDragFactorThreshold: this.rowingProfile().lowerDragFactorThreshold,
            maxDragFactorRecoveryPeriod: this.rowingProfile().maxDragFactorRecoveryPeriod,
            minimumDragTorque: this.rowingProfile().minimumDragTorque,
            minimumDriveTime: this.rowingProfile().minimumDriveTime,
            minimumPoweredTorque: this.rowingProfile().minimumPoweredTorque,
            minimumRecoverySlope: this.rowingProfile().minimumRecoverySlope,

            minimumRecoverySlopeMargin: this.rowingProfile().minimumRecoverySlopeMargin,
            minimumRecoveryTime: this.rowingProfile().minimumRecoveryTime,
            rotationDebounceTimeMin: this.rowingProfile().rotationDebounceTimeMin,
            rowingStoppedThresholdPeriod: this.rowingProfile().rowingStoppedThresholdPeriod,
            sprocketRadius: this.rowingProfile().sprocketRadius,
            strokeDetectionType: this.rowingProfile().strokeDetectionType,
            upperDragFactorThreshold: this.rowingProfile().upperDragFactorThreshold,
        });

        this.rowingProfile().strokeDetectionType === StrokeDetectionType.Torque
            ? this.rowingProfileForm.controls.minimumRecoverySlope.disable()
            : this.rowingProfileForm.controls.minimumRecoverySlope.enable();

        this.rowingProfile().strokeDetectionType === StrokeDetectionType.Slope
            ? this.rowingProfileForm.controls.minimumRecoverySlopeMargin.disable()
            : this.rowingProfileForm.controls.minimumRecoverySlopeMargin.enable();
    }

    updateStrokeDetectionType($event: MatSelectChange): void {
        switch ($event.value) {
            case StrokeDetectionType.Slope:
                this.rowingProfileForm.controls.minimumRecoverySlope.enable();
                this.rowingProfileForm.controls.minimumRecoverySlopeMargin.disable();
                break;
            case StrokeDetectionType.Torque:
                this.rowingProfileForm.controls.minimumRecoverySlopeMargin.enable();
                this.rowingProfileForm.controls.minimumRecoverySlope.disable();
                break;
            default:
                this.rowingProfileForm.controls.minimumRecoverySlopeMargin.enable();
                this.rowingProfileForm.controls.minimumRecoverySlope.enable();
        }
    }
}
