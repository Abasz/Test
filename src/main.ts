import { MediaMatcher } from "@angular/cdk/layout";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { DestroyRef, importProvidersFrom, isDevMode, provideZonelessChangeDetection } from "@angular/core";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar } from "@angular/material/snack-bar";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";

import { AppComponent } from "./app/app.component";
import { DashboardComponent } from "./app/dashboard/dashboard.component";
import { SpinnerOverlay } from "./common/overlay/spinner-overlay.service";
import { ErrorInterceptor } from "./common/services/error.interceptor.service";
import { AntHeartRateService } from "./common/services/heart-rate/ant-heart-rate.service";
import { CustomMediaMatcher } from "./common/utils/media-matcher-override";

// --- Global Console Log Redirection with Buffering ---
(function () {
    const buffer: { type: "log" | "warn" | "error"; args: any[] }[] = [];
    let logDiv: HTMLElement | null = null;
    const appendLog = (type: "log" | "warn" | "error", args: any[]) => {
        if (!logDiv) {
            buffer.push({ type, args });
            return;
        }
        const p = document.createElement("p");
        p.style.margin = "0";
        p.style.padding = "0";
        p.style.whiteSpace = "pre-wrap";
        if (type === "warn") p.style.color = "#b26a00";
        if (type === "error") p.style.color = "#c62828";
        p.textContent = args
            .map((a) => {
                if (typeof a === "object") {
                    try {
                        return JSON.stringify(a, null, 2);
                    } catch {
                        return "[object]";
                    }
                }
                return String(a);
            })
            .join(" ");
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    };
    ["log", "warn", "error"].forEach((type) => {
        const orig = console[type as "log" | "warn" | "error"];
        console[type as "log" | "warn" | "error"] = function (...args: any[]) {
            appendLog(type as "log" | "warn" | "error", args);
            orig.apply(console, args);
        };
    });
    // Wait for DOMContentLoaded to flush buffer
    function tryFlush() {
        logDiv = document.getElementById("global-console-log");
        if (logDiv) {
            buffer.forEach((entry) => appendLog(entry.type, entry.args));
            buffer.length = 0;
        } else {
            setTimeout(tryFlush, 50);
        }
    }
    tryFlush();
})();

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter([
            {
                path: "",
                loadComponent: async (): Promise<typeof DashboardComponent> =>
                    (await import("./app/dashboard/dashboard.component")).DashboardComponent,
            },
            { path: "**", redirectTo: "" },
        ]),
        SpinnerOverlay,
        provideAnimations(),
        // workaround to override Angular Material's no animation in case of reduced motion preference
        { provide: MediaMatcher, useClass: CustomMediaMatcher },
        importProvidersFrom(
            ServiceWorkerModule.register("ngsw-worker.js", {
                enabled: !isDevMode(),
                // register the ServiceWorker as soon as the application is stable
                // or after 10 seconds (whichever comes first).
                registrationStrategy: "registerWhenStable:10000",
            }),
        ),
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {
            provide: AntHeartRateService,
            useFactory: (snack: MatSnackBar, destroyRef: DestroyRef): AntHeartRateService => {
                if (isSecureContext === true) {
                    return new AntHeartRateService(snack, destroyRef);
                }

                return {
                    discover: (): Promise<void> => {
                        throw Error("WebUSB API is not available");
                    },
                } as unknown as AntHeartRateService;
            },
            deps: [MatSnackBar, DestroyRef],
        },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {
                duration: 5000,
                verticalPosition: "top",
                horizontalPosition: "end",
            },
        },
    ],
}).catch((err: unknown): void => {
    const match = navigator.userAgent.match(
        /(?<ios>iPad|iPhone|iPod)|(?<ipadmac>Macintosh).*?(?=\))(?=.*?Mobile)|(?<browser>CriOS|Chrome|Safari|Firefox|Edg)/,
    );

    const overlay = document.getElementById("global-error-overlay");
    const msg = document.getElementById("global-error-message");
    const advice = document.getElementById("global-error-advice");
    if (overlay && msg && advice) {
        overlay.classList.add("active");
        msg.textContent = err instanceof Error ? err.message : String(err);
        if (match?.groups?.ios || (match?.groups?.ipadmac && "ontouchend" in window)) {
            advice.innerHTML = `<p><strong>Browser compatibility:</strong></p>
                <p>You are using iOS (${match?.groups?.browser ?? "Unknown"}). Web Bluetooth is <b>not supported</b> in any browser on iOS due to Apple platform restrictions. Please use a supported browser on Android, Windows, Linux, or macOS.</p>`;
        } else {
            advice.innerHTML = "";
        }
    }

    console.error("Angular bootstrap failed:", err);
});
