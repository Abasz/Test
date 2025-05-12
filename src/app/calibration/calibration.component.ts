import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal, Signal, WritableSignal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatToolbar } from "@angular/material/toolbar";
import { interval, map } from "rxjs";

import { ConnectErgButtonComponent } from "../toolbar-buttons/connect-erg-button.component";
import { OpenSettingsButtonComponent } from "../toolbar-buttons/open-settings-button.component";

import { UtilsService } from "./../../common/services/utils.service";
import { CalibrationDataComponent } from "./calibration-data/calibration-data.component";
import {
    ICalibrationRowingMetrics,
    ICalibrationTotals,
    IPairWithIndex,
    IRowingMetrics,
} from "./calibration.interfaces";
import { DeltaTimesComponent } from "./delta-times/delta-times.component";
import { RowingProfileEditorComponent } from "./erg-settings/rowing-profile-editor.component";
import { RowingProfileManagerService } from "./rowing-profile-manager.service";
import { StrokeReplayComponent } from "./stroke-replay/stroke-replay.component";
import { TotalsComponent } from "./totals/totals.component";

@Component({
    selector: "app-calibration",
    templateUrl: "./calibration.component.html",
    styleUrls: ["./calibration.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatToolbar,
        DatePipe,
        ConnectErgButtonComponent,
        OpenSettingsButtonComponent,
        TotalsComponent,
        RowingProfileEditorComponent,
        CalibrationDataComponent,
        DeltaTimesComponent,
        StrokeReplayComponent,
    ],
})
export class CalibrationComponent {
    deltaTimesLog: WritableSignal<Array<number>> = signal([]);
    marginDetect: WritableSignal<number> = signal(0);
    rowingMetrics: WritableSignal<Array<IRowingMetrics>> = signal([]);
    rowingMetricsTotals: WritableSignal<ICalibrationTotals> = signal({
        distance: 0,
        lastRevTime: 0,
        lastStrokeTime: 0,
        strokeCount: 0,
        driveDuration: 0,
        recoveryDuration: 0,
        avgStrokePower: 0,
        dragCoefficient: 0,
        driveHandleForcesMin: { value: 0, index: 0 },
        driveHandleForcesMax: { value: 0, index: 0 },
    });

    minDeltaTimeChartValue: WritableSignal<number | undefined> = signal(undefined);

    isBleAvailable: boolean = isSecureContext && navigator.bluetooth !== undefined;

    timeOfDay: Signal<number> = toSignal(interval(1000).pipe(map((): number => Date.now())), {
        initialValue: Date.now(),
    });

    constructor(
        public rowingProfileManager: RowingProfileManagerService,
        private utilsService: UtilsService,
    ) {}

    runCalibration(deltaTimes: Array<number>): void {
        if (typeof Worker !== "undefined") {
            this.utilsService.mainSpinner().open();
            const worker = new Worker(new URL("./calibration.worker", import.meta.url));
            worker.onmessage = ({ data }: MessageEvent<ICalibrationRowingMetrics>): void => {
                this.deltaTimesLog.set(data.deltaTimesLog);
                this.marginDetect.set(data.marginDetect);
                this.rowingMetrics.set(data.rowingMetrics);

                const driveHandleForces: Array<Array<number>> = data.rowingMetrics
                    .map(({ driveHandleForces }: IRowingMetrics): Array<number> => driveHandleForces)
                    .slice(0, -1);

                const minIndex: number = driveHandleForces.reduce(
                    (
                        minIdx: number,
                        current: Array<number>,
                        idx: number,
                        arr: Array<Array<number>>,
                    ): number => (current.length < arr[minIdx].length ? idx : minIdx),
                    0,
                );

                const driveHandleForcesMin: IPairWithIndex = {
                    value: driveHandleForces[minIndex]?.length,
                    index: minIndex,
                };

                const maxIndex: number = driveHandleForces.reduce(
                    (
                        maxIndex: number,
                        current: Array<number>,
                        idx: number,
                        arr: Array<Array<number>>,
                    ): number => (current.length > arr[maxIndex].length ? idx : maxIndex),
                    0,
                );
                const driveHandleForcesMax: IPairWithIndex = {
                    value: driveHandleForces[maxIndex]?.length,
                    index: maxIndex,
                };

                const metricsExcludingLast = data.rowingMetrics.slice(0, -1);
                this.rowingMetricsTotals.set({
                    distance: data.rowingMetrics[data.rowingMetrics.length - 1].distance,
                    strokeCount: data.rowingMetrics[data.rowingMetrics.length - 1].strokeCount,
                    dragCoefficient:
                        metricsExcludingLast.reduce(
                            (sum: number, metrics: IRowingMetrics): number => sum + metrics.dragCoefficient,
                            0,
                        ) / metricsExcludingLast.length,
                    lastRevTime: data.rowingMetrics[data.rowingMetrics.length - 1].lastRevTime,
                    lastStrokeTime: data.rowingMetrics[data.rowingMetrics.length - 1].lastStrokeTime,
                    driveDuration:
                        metricsExcludingLast.reduce(
                            (sum: number, metrics: IRowingMetrics): number => sum + metrics.driveDuration,
                            0,
                        ) / metricsExcludingLast.length,
                    recoveryDuration:
                        metricsExcludingLast.reduce(
                            (sum: number, metrics: IRowingMetrics): number => sum + metrics.recoveryDuration,
                            0,
                        ) / metricsExcludingLast.length,
                    avgStrokePower:
                        metricsExcludingLast.reduce(
                            (sum: number, metrics: IRowingMetrics): number => sum + metrics.avgStrokePower,
                            0,
                        ) / metricsExcludingLast.length,
                    driveHandleForcesMin: driveHandleForcesMin,
                    driveHandleForcesMax: driveHandleForcesMax,
                });

                this.minDeltaTimeChartValue.set(data.minDeltaTimeChartValue);
                this.utilsService.mainSpinner().close();
            };
            worker.postMessage({ deltaTimes, settings: this.rowingProfileManager.profile() });
        } else {
            // web workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
        }
    }
}
