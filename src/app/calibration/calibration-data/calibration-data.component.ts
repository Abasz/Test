import { DatePipe } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    output,
    OutputEmitterRef,
    Signal,
    viewChild,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { map } from "rxjs";

import { ISessionSummary } from "../../../common/common.interfaces";

import { DataRecorderService } from "./../../../common/services/data-recorder.service";

@Component({
    selector: "app-calibration-data",
    templateUrl: "./calibration-data.component.html",
    styleUrls: ["./calibration-data.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIcon,
        DatePipe,
    ],
})
export class CalibrationDataComponent {
    fileInput: Signal<ElementRef> = viewChild.required("fileInput");
    fileSelect: FormControl<File | undefined> = new FormControl();

    readonly onSimulationClick: OutputEmitterRef<Array<number>> = output();

    sessionSelect: FormControl<ISessionSummary | undefined> = new FormControl();

    readonly sessions: Signal<Array<ISessionSummary>> = toSignal(
        this.dataRecorderService
            .getSessionSummaries$()
            .pipe(
                map(
                    (sessions: Array<ISessionSummary>): Array<ISessionSummary> =>
                        sessions.sort(
                            (a: ISessionSummary, b: ISessionSummary): number => b.sessionId - a.sessionId,
                        ),
                ),
            ),
        {
            // TODO: needs loading indicator for the select
            initialValue: [],
        },
    );
    constructor(private dataRecorderService: DataRecorderService) {}

    async emitSimulationClick(): Promise<void> {
        if (!this.sessionSelect.value && !this.fileSelect.value) {
            return;
        }

        if (this.sessionSelect.value) {
            this.onSimulationClick.emit(
                await this.dataRecorderService.getDeltaTimes(this.sessionSelect.value.sessionId),
            );
        }

        if (this.fileSelect.value) {
            this.onSimulationClick.emit(
                (await this.fileSelect.value.text())
                    .trim()
                    .split("\n")
                    .map((value: string): number => parseInt(value, 10)),
            );
        }
    }

    loadFile($event: Event): void {
        const inputElement = $event.currentTarget;
        if (!(inputElement instanceof HTMLInputElement) || !inputElement?.files?.[0]) {
            return;
        }

        this.fileSelect.setValue(inputElement.files[0]);
        this.sessionSelect.setValue(undefined);
    }

    resetData(): void {
        this.sessionSelect.setValue(undefined);
        this.fileSelect.setValue(undefined);
        this.fileInput().nativeElement.value = "";
    }

    selectChanged($event: MatSelectChange): void {
        if ($event.value) {
            this.fileSelect.setValue(undefined);
            this.fileInput().nativeElement.value = "";
        }
    }
}
