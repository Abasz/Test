import { DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, InputSignal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

import { ICalibrationTotals } from "../calibration.interfaces";

@Component({
    selector: "app-totals",
    templateUrl: "./totals.component.html",
    styleUrls: ["./totals.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, DecimalPipe],
})
export class TotalsComponent {
    readonly rowingMetricsTotals: InputSignal<ICalibrationTotals> = input.required();
    readonly marginDetect: InputSignal<number> = input.required();
}
