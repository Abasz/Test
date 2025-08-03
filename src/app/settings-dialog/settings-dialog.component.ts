import { CdkScrollable } from "@angular/cdk/scrolling";
import { AsyncPipe } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    Inject,
    Signal,
    signal,
    viewChild,
    WritableSignal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { firstValueFrom, map, Observable } from "rxjs";

import { IDeviceInformation } from "../../common/ble.interfaces";
import {
    HeartRateMonitorMode,
    IErgConnectionStatus,
    IRowerSettings,
    IStrokeDetectionSettings,
} from "../../common/common.interfaces";
import { ConfigManagerService } from "../../common/services/config-manager.service";
import { ErgSettingsService } from "../../common/services/ergometer/erg-settings.service";
import { UtilsService } from "../../common/services/utils.service";
import { SnackBarConfirmComponent } from "../../common/snack-bar-confirm/snack-bar-confirm.component";

import { GeneralSettingsComponent } from "./general-settings.component";
import { AdvancedSettingsComponent, AdvancedSettingsFormGroup } from "./rower-settings.component";
import { ErgConnectionService } from "../../common/services/ergometer/erg-connection.service";

@Component({
    selector: "app-settings-dialog",
    templateUrl: "./settings-dialog.component.html",
    styleUrls: ["./settings-dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatTab,
        MatTabGroup,
        GeneralSettingsComponent,
        AdvancedSettingsComponent,
        AsyncPipe,
    ],
})
export class SettingsDialogComponent {
    readonly advancedSettings: Signal<AdvancedSettingsComponent> =
        viewChild.required(AdvancedSettingsComponent);
    readonly generalSettings: Signal<GeneralSettingsComponent> = viewChild.required(GeneralSettingsComponent);

    readonly isSaveButtonEnabled: Signal<boolean> = computed((): boolean => {
        const currentTab = this.currentTabIndex();
        const isGeneralFormSaveable = this.isGeneralFormSaveable();
        const isRowerFormSaveable = this.isRowerFormSaveable();

        return (currentTab === 0 && isGeneralFormSaveable) || (currentTab === 1 && isRowerFormSaveable);
    });

    breakPoints$: Observable<boolean> = this.utils
        .breakpointHelper([[599, "max"]])
        .pipe(map((value: { [key: string]: boolean }): boolean => value.maxW599));

    currentTabIndex: WritableSignal<number> = signal<number>(0);

    private readonly isGeneralFormSaveable: WritableSignal<boolean> = signal<boolean>(true);
    private readonly isRowerFormSaveable: WritableSignal<boolean> = signal<boolean>(true);

    private isSaving: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<SettingsDialogComponent>,
        private utils: UtilsService,
        private configManager: ConfigManagerService,
        private ergSettingsService: ErgSettingsService,
        private ergConnectionService: ErgConnectionService,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            rowerSettings: IRowerSettings;
            strokeDetectionSettings: IStrokeDetectionSettings;
            ergConnectionStatus: IErgConnectionStatus;
            deviceInfo: IDeviceInformation;
        },
    ) {
        this.breakPoints$.pipe(takeUntilDestroyed()).subscribe((isSmallScreen: boolean): void => {
            if (isSmallScreen) {
                this.dialogRef.updateSize("90%");

                return;
            }

            this.dialogRef.updateSize("560px");
        });

        this.dialogRef.disableClose = true;
        this.dialogRef
            .backdropClick()
            .pipe(takeUntilDestroyed())
            .subscribe((): Promise<void> => this.handleDialogClose());
        this.dialogRef
            .keydownEvents()
            .pipe(takeUntilDestroyed())
            .subscribe((event: KeyboardEvent): void => {
                if (event.key === "Escape") {
                    this.handleDialogClose();
                }
            });
    }

    onGeneralFormValidityChange(isValid: boolean): void {
        this.isGeneralFormSaveable.set(isValid && this.generalSettings().getForm().dirty);
    }

    onRowerFormValidityChange(isValid: boolean): void {
        this.isRowerFormSaveable.set(
            isValid && (this.advancedSettings().getForm().dirty || this.advancedSettings().isProfileLoaded),
        );
    }

    async saveSettings(): Promise<void> {
        if (this.isSaving) {
            return;
        }

        this.isSaving = true;

        try {
            if (
                ((this.currentTabIndex() === 0 && this.isRowerFormSaveable()) ||
                    (this.currentTabIndex() === 1 && this.isGeneralFormSaveable())) &&
                (await this.showSaveConfirmation())
            ) {
                await this.saveGeneralSettings();
                await this.saveAdvancedSettings();
            } else {
                this.currentTabIndex() === 0
                    ? await this.saveGeneralSettings()
                    : await this.saveAdvancedSettings();
            }

            this.dialogRef.close();
        } finally {
            this.isSaving = false;
        }
    }

    onTabChange(newTabIndex: number): void {
        this.currentTabIndex.set(newTabIndex);
    }

    async handleDialogClose(): Promise<void> {
        if (
            (!this.advancedSettings().getForm().dirty && !this.generalSettings().getForm().dirty) ||
            (await firstValueFrom(
                this.snackBar
                    .openFromComponent(SnackBarConfirmComponent, {
                        duration: undefined,
                        data: {
                            text: "You have unsaved changes. Close without saving?",
                            cancel: "No",
                        },
                    })
                    .onAction()
                    .pipe(map((): boolean => true)),
                { defaultValue: false },
            ))
        ) {
            this.dialogRef.close();
        }
    }

    private async saveGeneralSettings(): Promise<void> {
        const settingsForm = this.generalSettings().getForm();

        if (settingsForm.controls.logLevel.dirty) {
            await this.ergSettingsService.changeLogLevel(settingsForm.controls.logLevel.value);
        }

        if (settingsForm.controls.deltaTimeLogging.dirty) {
            await this.ergSettingsService.changeDeltaTimeLogging(
                settingsForm.controls.deltaTimeLogging.value,
            );
        }

        if (settingsForm.controls.logToSdCard.dirty) {
            await this.ergSettingsService.changeLogToSdCard(settingsForm.controls.logToSdCard.value);
        }

        if (settingsForm.controls.bleMode.dirty) {
            await this.ergSettingsService.changeBleServiceType(settingsForm.controls.bleMode.value);
        }

        if (settingsForm.controls.heartRateMonitor.dirty) {
            this.configManager.setItem(
                "heartRateMonitor",
                settingsForm.value.heartRateMonitor as HeartRateMonitorMode,
            );
        }
    }

    private async saveAdvancedSettings(): Promise<void> {
        const advancedSettingsForm = this.advancedSettings().getForm();
        const isProfileLoaded = this.advancedSettings().isProfileLoaded;

        if (advancedSettingsForm.dirty) {
            this.advancedSettings().saveAsCustomProfile();
        }

        if (isProfileLoaded || advancedSettingsForm.controls.machineSettings.dirty) {
            const machineSettings = advancedSettingsForm.controls.machineSettings.getRawValue();

            await this.ergSettingsService.changeMachineSettings(machineSettings);
        }

        await this.handleSensorAndDragSettings(advancedSettingsForm, isProfileLoaded);

        if (isProfileLoaded || advancedSettingsForm.controls.strokeDetectionSettings.dirty) {
            const strokeDetectionSettings =
                advancedSettingsForm.controls.strokeDetectionSettings.getRawValue();

            await this.ergSettingsService.changeStrokeSettings(strokeDetectionSettings);
        }

        if (isProfileLoaded || advancedSettingsForm.dirty) {
            await this.ergSettingsService.restartDevice();
            await this.ergConnectionService.reconnect();
        }
    }

    private async handleSensorAndDragSettings(
        form: AdvancedSettingsFormGroup,
        isLoaded: boolean,
    ): Promise<void> {
        const sensorSettingsForm = form.controls.sensorSignalSettings;
        const dragSettingsForm = form.controls.dragFactorSettings;

        const isSensorSettingsDirty = isLoaded || sensorSettingsForm.dirty;
        const isDragSettingsDirty = isLoaded || dragSettingsForm.dirty;

        if (!isSensorSettingsDirty && !isDragSettingsDirty) {
            return;
        }

        const newSensorSettings = sensorSettingsForm.getRawValue();
        const newDragSettings = dragSettingsForm.getRawValue();

        const isRotationDebounceIncreased =
            newSensorSettings.rotationDebounceTime >
            this.data.rowerSettings.sensorSignalSettings.rotationDebounceTime;
        const isMaxDragFactorRecoveryPeriodIncreased =
            newDragSettings.maxDragFactorRecoveryPeriod >
            this.data.rowerSettings.dragFactorSettings.maxDragFactorRecoveryPeriod;

        if (isRotationDebounceIncreased && isMaxDragFactorRecoveryPeriodIncreased) {
            await this.ergSettingsService.changeSensorSignalSettings(newSensorSettings);
            await this.ergSettingsService.changeDragFactorSettings(newDragSettings);

            return;
        }

        if (isDragSettingsDirty) {
            await this.ergSettingsService.changeDragFactorSettings(newDragSettings);
        }

        if (isSensorSettingsDirty) {
            await this.ergSettingsService.changeSensorSignalSettings(newSensorSettings);
        }
    }

    private showSaveConfirmation(): Promise<boolean> {
        return firstValueFrom(
            this.snackBar
                .openFromComponent(SnackBarConfirmComponent, {
                    duration: undefined,
                    data: {
                        text: `${this.currentTabIndex() === 1 ? "General" : "Rower"} tab has changes, save those too?`,
                        cancel: "No",
                    },
                })
                .onAction()
                .pipe(map((): boolean => true)),
            { defaultValue: false },
        );
    }
}
