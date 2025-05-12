import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, Observable, pairwise, shareReplay, startWith } from "rxjs";

import { IRowingProfile } from "../../app/calibration/calibration.interfaces";
import { Config, HeartRateMonitorMode, IConfig } from "../common.interfaces";

@Injectable({
    providedIn: "root",
})
export class ConfigManagerService {
    readonly heartRateMonitorChanged$: Observable<HeartRateMonitorMode>;

    private configSubject: BehaviorSubject<Config>;

    constructor() {
        let config = Object.fromEntries(
            (Object.keys(new Config()) as Array<keyof Config>).map(
                (key: keyof Config): [keyof Config, string | IRowingProfile] => {
                    const value = localStorage.getItem(key) ?? new Config()[key];

                    return [key, value];
                },
            ),
        ) as unknown as Config;

        if (!isSecureContext || navigator.bluetooth === undefined) {
            config = {
                ...config,
                heartRateMonitor: "off",
                heartRateBleId: "",
                ergoMonitorBleId: "",
            };

            localStorage.setItem("heartRateMonitor", "off");
            localStorage.setItem("heartRateBleId", "");
            localStorage.setItem("ergoMonitorBleId", "");
        }

        this.configSubject = new BehaviorSubject(config);

        this.heartRateMonitorChanged$ = this.configSubject.pipe(
            pairwise(),
            filter(
                ([previous, current]: [Config, Config]): boolean =>
                    previous.heartRateMonitor !== current.heartRateMonitor,
            ),
            map(([_, current]: [Config, Config]): HeartRateMonitorMode => current.heartRateMonitor),
            startWith(this.configSubject.value.heartRateMonitor),
            shareReplay(1),
        );
    }

    getConfig(): IConfig {
        return { ...this.configSubject.value };
    }

    getItem(name: keyof Config): Config[keyof Config] {
        return this.configSubject.value[name];
    }

    setItem(name: keyof Config, value: Config[keyof Config]): void {
        if (typeof value === "string") {
            localStorage.setItem(name, value);
        }
        if (typeof value === "object") {
            localStorage.setItem(name, JSON.stringify(value));
        }

        this.configSubject.next({ ...this.configSubject.value, [name]: value });
    }
}
