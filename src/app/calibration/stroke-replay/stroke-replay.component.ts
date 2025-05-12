import { DecimalPipe } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    InputSignal,
    model,
    ModelSignal,
    Signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
    CategoryScale,
    ChartConfiguration,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    Point,
    PointElement,
    Title,
} from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { BaseChartDirective, provideCharts } from "ng2-charts";

import { SecondsToTimePipe } from "../../../common/utils/seconds-to-time.pipe";
import { IRowingMetrics } from "../calibration.interfaces";

@Component({
    selector: "app-stroke-replay",
    templateUrl: "./stroke-replay.component.html",
    styleUrls: ["./stroke-replay.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        FormsModule,
        MatLabel,
        MatInputModule,
        MatButtonModule,
        BaseChartDirective,
        DecimalPipe,
        SecondsToTimePipe,
    ],
    providers: [
        provideCharts({
            registerables: [
                LineController,
                LineElement,
                PointElement,
                LinearScale,
                CategoryScale,
                Filler,
                Title,
                Legend,
                ChartDataLabels,
            ],
        }),
    ],
})
export class StrokeReplayComponent {
    readonly rowingMetrics: InputSignal<Array<IRowingMetrics>> = input.required();
    readonly stroke: ModelSignal<number> = model(1);
    readonly strokeData: Signal<IRowingMetrics> = computed(
        (): IRowingMetrics =>
            this.rowingMetrics()?.[this.stroke() - 1] ?? {
                strokeCount: 0,
                distance: 0,
                lastRevTime: 0,
                lastStrokeTime: 0,
                driveDuration: 0,
                recoveryDuration: 0,
                avgStrokePower: 0,
                dragCoefficient: 0,
                driveHandleForces: [],
            },
    );
    readonly distancePerStroke: Signal<number> = computed((): number => {
        const metrics = this.rowingMetrics();
        const stroke = this.stroke();

        if (stroke <= 1 || stroke >= metrics.length) {
            return 0;
        }

        return metrics[stroke].distance - metrics[stroke - 1].distance;
    });

    forceChartOptions: ChartOptions<"line"> = {
        responsive: false,
        maintainAspectRatio: true,
        animation: false,
        plugins: {
            datalabels: {
                anchor: "center",
                align: "top",
                formatter: (value: Point): string => `Peak: ${Math.round(value.y)}`,
                display: (ctx: Context): boolean =>
                    Math.max(...(ctx.dataset.data as Array<Point>).map((point: Point): number => point.y)) ===
                    (ctx.dataset.data[ctx.dataIndex] as Point).y,
                font: {
                    size: 16,
                },
                color: "rgb(0,0,0)",
            },
            legend: {
                title: {
                    display: true,
                    text: "Force Curve",
                    color: "rgb(0,0,0)",
                    font: {
                        size: 32,
                    },
                    padding: {},
                },
                labels: {
                    boxWidth: 0,
                    font: {
                        size: 0,
                    },
                },
            },
        },
        scales: {
            x: {
                type: "linear",
                display: false,
                ticks: { stepSize: 1 },
            },
            y: {
                ticks: {
                    color: "rgba(0,0,0)",
                },
            },
        },
    };

    handleForcesChart: Signal<ChartConfiguration<"line">["data"]> = computed(
        (): ChartConfiguration<"line">["data"] => {
            this._handleForcesChart.datasets[0].data = this.strokeData().driveHandleForces.map(
                (currentForce: number, index: number): Point => ({
                    y: currentForce,
                    x: index,
                }),
            );

            return { ...this._handleForcesChart };
        },
    );

    private _handleForcesChart: ChartConfiguration<"line">["data"] = {
        datasets: [
            {
                fill: true,
                label: "Force Curve",
                data: [],
                borderColor: "rgb(31,119,180)",
                backgroundColor: "rgb(31,119,180,0.5)",
                pointRadius: 0,
            },
        ],
    };

    next(): void {
        if (this.stroke() < this.rowingMetrics().length) {
            this.stroke.set(this.stroke() + 1);
        }
    }

    previous(): void {
        if (this.stroke() > 1) {
            this.stroke.set(this.stroke() - 1);
        }
    }
}
