import { Injectable, Signal, signal, WritableSignal } from "@angular/core";

import { ConfigManagerService } from "../../common/services/config-manager.service";

import { IRowingProfile } from "./calibration.interfaces";

@Injectable({ providedIn: "root" })
export class RowingProfileManagerService {
    readonly profile: Signal<IRowingProfile>;

    private rowerProfile: WritableSignal<IRowingProfile>;
    constructor(private configManagerService: ConfigManagerService) {
        this.rowerProfile = signal(this.configManagerService.getConfig().rowingConfiguration);
        this.profile = this.rowerProfile.asReadonly();
    }

    updateProfile(newProfile: IRowingProfile): void {
        this.rowerProfile.set(newProfile);
    }
}
