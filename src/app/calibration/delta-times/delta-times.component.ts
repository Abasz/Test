import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    InputSignal,
    model,
    ModelSignal,
    Signal,
    viewChild,
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
    Legend,
    LinearScale,
    LineController,
    LineElement,
    Point,
    PointElement,
    Title,
    Tooltip,
    TooltipItem,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { BaseChartDirective, provideCharts } from "ng2-charts";

import { upperQuartile } from "../../../common/utils/utility.functions";

@Component({
    selector: "app-delta-times",
    templateUrl: "./delta-times.component.html",
    styleUrls: ["./delta-times.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MatLabel, MatInputModule, MatCardModule, MatButtonModule, BaseChartDirective],
    providers: [
        provideCharts({
            registerables: [
                LineController,
                LineElement,
                PointElement,
                LinearScale,
                CategoryScale,
                Title,
                Legend,
                Tooltip,
                zoomPlugin,
            ],
        }),
    ],
})
export class DeltaTimesComponent {
    readonly deltaTimes: InputSignal<Array<number>> = input.required();
    readonly strokeCount: InputSignal<number> = input.required();
    readonly min: InputSignal<number | undefined> = input<number | undefined>(undefined);
    readonly maxForm: ModelSignal<number | undefined> = model();
    readonly max: Signal<number | undefined> = computed((): number | undefined => {
        const maxForm = this.maxForm();
        const deltaTimes = this.deltaTimes();
        const min = this.min();

        if (maxForm && maxForm > (min || 0)) {
            return maxForm;
        }

        return deltaTimes.length > 3 ? Math.ceil(upperQuartile(deltaTimes) / 10000) * 10000 : undefined;
    });
    readonly chart: Signal<BaseChartDirective> = viewChild.required(BaseChartDirective);

    deltaTimesChart: Signal<ChartConfiguration<"line">["data"]> = computed(
        (): ChartConfiguration<"line">["data"] => {
            this._deltaTimesChart.datasets[0].data = this.deltaTimes().map(
                (deltaTime: number, index: number): Point => ({
                    y: deltaTime,
                    x: index,
                }),
            );

            return { ...this._deltaTimesChart };
        },
    );

    deltaTimesChartOptions: Signal<ChartOptions<"line">> = computed(
        (): ChartOptions<"line"> => ({
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                tooltip: {
                    enabled: true,
                    intersect: false,
                    mode: "x",
                    axis: "y",
                    yAlign: "bottom",
                    filter: (tooltipItem: TooltipItem<"line">): boolean =>
                        tooltipItem.parsed.y <= this.strokeCount(),
                },
                datalabels: {
                    anchor: "center",
                    align: "top",
                    display: false,
                    font: {
                        size: 16,
                    },
                    color: "rgb(0,0,0)",
                },
                legend: {
                    title: {
                        display: true,
                        text: "Delta Times",
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
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x",
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                            modifierKey: "ctrl",
                        },
                        pinch: {
                            enabled: true,
                        },
                        drag: {
                            enabled: true,
                            modifierKey: "ctrl",
                        },
                        mode: "x",
                    },
                    limits: {
                        x: {
                            min: "original",
                            max: "original",
                        },
                    },
                },
                decimation: {
                    enabled: true,
                },
            },
            scales: {
                x: {
                    type: "linear",
                    ticks: { stepSize: 1_000 },
                },
                y: {
                    ticks: { color: "rgba(0,0,0)" },
                    min: this.min(),
                    max: this.max(),
                },
            },
        }),
    );

    private _deltaTimesChart: ChartConfiguration<"line">["data"] = {
        datasets: [
            {
                fill: false,
                label: "Delta Times",
                data: [],
                borderColor: "rgb(31,119,180)",
                backgroundColor: "rgb(31,119,180,0.5)",
                pointRadius: 0,
                parsing: false,
            },
        ],
    };

    resetZoom(): void {
        this.chart().chart?.resetZoom();

        // const xScale = this.chart().chart?.scales.x;

        // if (xScale) {
        //     const currentMin = xScale.getPixelForValue(xScale.min);
        //     const currentMax = xScale.getPixelForValue(xScale.max);

        //     console.log("currentMax", currentMax, currentMin);

        //     const targetCenter = xScale.getPixelForValue(10000);
        //     const currentCenter = (currentMax + currentMin) / 2;
        //     console.log("currentCenter", currentCenter);

        //     const delta = targetCenter - currentCenter;

        //     console.log("delta", delta);

        //     this.chart().chart?.pan({
        //         x: -delta,
        //     });
        // }
    }
}
