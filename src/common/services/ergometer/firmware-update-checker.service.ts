import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom } from "rxjs";

import { ErgGenericDataService } from "./erg-generic-data.service";

interface GitHubRelease {
    published_at: string;
    updated_at: string;
    tag_name: string;
    name: string;
}

@Injectable({
    providedIn: "root",
})
export class FirmwareUpdateCheckerService {
    private readonly GITHUB_API_URL: string =
        "https://api.github.com/repos/Abasz/ESPRowingMonitor/releases/latest";
    private updateIsInProgress: boolean = false;

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private ergGenericDataService: ErgGenericDataService,
    ) {}

    /**
     * Checks for firmware updates by comparing the device firmware version
     * with the latest GitHub release. Shows a snackbar if an update is available.
     */
    async checkForFirmwareUpdate(): Promise<void> {
        try {
            if (this.updateIsInProgress === true) {
                return;
            }

            this.updateIsInProgress = true;

            const firmwareNumber = this.ergGenericDataService.deviceInfo().firmwareNumber;

            if (!firmwareNumber) {
                console.warn("Could not retrieve device firmware version");

                return;
            }

            const latestRelease: GitHubRelease = await firstValueFrom(
                this.http.get<GitHubRelease>(this.GITHUB_API_URL),
            );

            const releaseDate = new Date(latestRelease.updated_at);
            const firmwareDate = this.parseFirmwareVersionToDate(firmwareNumber);

            const releaseDateOnly = new Date(
                releaseDate.getFullYear(),
                releaseDate.getMonth(),
                releaseDate.getDate(),
            );
            const firmwareDateOnly = new Date(
                firmwareDate.getFullYear(),
                firmwareDate.getMonth(),
                firmwareDate.getDate(),
            );

            if (releaseDateOnly > firmwareDateOnly) {
                this.snackBar
                    .open(`Firmware update available: ${latestRelease.tag_name}`, "View on GitHub", {
                        duration: 30000,
                    })
                    .onAction()
                    .subscribe((): void => {
                        window.open("https://github.com/Abasz/ESPRowingMonitor/releases/latest", "_blank");
                    });
            }
        } catch (error) {
            console.warn("Failed to check for firmware updates:", error);
        } finally {
            this.updateIsInProgress = false;
        }
    }

    /**
     * Parses firmware version string to Date object
     * Assumes firmware version format is YYYYMMDD or contains a date
     */
    private parseFirmwareVersionToDate(firmwareVersion: string): Date {
        const match = /^(\d{4})(\d{2})(\d{2})$/.exec(firmwareVersion);
        if (!match) {
            throw new Error("Invalid yyyymmdd format");
        }
        const [, year, month, day]: RegExpMatchArray = match;

        return new Date(Number(year), Number(month) - 1, Number(day));
    }
}
