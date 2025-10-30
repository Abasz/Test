import { MediaMatcher } from "@angular/cdk/layout";
import { HTTP_INTERCEPTORS, provideHttpClient } from "@angular/common/http";
import { DestroyRef, provideZonelessChangeDetection } from "@angular/core";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar } from "@angular/material/snack-bar";
import { bootstrapApplication } from "@angular/platform-browser";
import { SwUpdate } from "@angular/service-worker";
import { EMPTY } from "rxjs";

import { AppComponent } from "./app/app.component";
import { SpinnerOverlay } from "./common/overlay/spinner-overlay.service";
import { ErrorInterceptor } from "./common/services/error.interceptor.service";
import { AntHeartRateService } from "./common/services/heart-rate/ant-heart-rate.service";
import { ConsoleDomLogger } from "./common/utils/console-dom-logger";
import { CustomMediaMatcher } from "./common/utils/media-matcher-override";

// initialize console DOM logger for development debugging
ConsoleDomLogger.getInstance().initialize();

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        // provideRouter(
        //     [
        //         {
        //             path: "",
        //             component: DashboardComponent,
        //         },
        //         { path: "**", redirectTo: "" },
        //     ],
        //     withDebugTracing(),
        // ),
        SpinnerOverlay,
        // workaround to override Angular Material's no animation in case of reduced motion preference
        { provide: MediaMatcher, useClass: CustomMediaMatcher },
        {
            provide: SwUpdate,
            useValue: {
                versionUpdates: EMPTY,
                unrecoverable: EMPTY,
                checkForUpdate: (): Promise<boolean> => Promise.resolve(false),
                activateUpdate: (): Promise<boolean> => Promise.resolve(false),
                isEnabled: false,
            },
        },
        // importProvidersFrom(
        //     ServiceWorkerModule.register("ngsw-worker.js", {
        //         enabled: !isDevMode() || !navigator.serviceWorker || !navigator.userAgent.includes("iP"),
        //         // register the ServiceWorker as soon as the application is stable
        //         // or after 10 seconds (whichever comes first).
        //         registrationStrategy: "registerWhenStable:10000",
        //     }),
        // ),
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
    const handleError = (): void => {
        const match = navigator.userAgent.match(
            /(?<ios>iPad|iPhone|iPod)|(?<ipadmac>Macintosh).*?(?=\))(?=.*?Mobile)|(?<browser>CriOS|Chrome|Safari|Firefox|Edg)/,
        );

        console.log("Match result:", match);
        console.log("Document ready state:", document.readyState);

        const overlay = document.getElementById("global-error-overlay");
        const msg = document.getElementById("global-error-message");
        const advice = document.getElementById("global-error-advice");

        console.log("Elements found:", { overlay: !!overlay, msg: !!msg, advice: !!advice });

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
    };

    // ensure DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", handleError);
    } else {
        handleError();
    }

    console.error("Angular bootstrap failed:", err instanceof Error ? err.message : String(err));
    console.error("Angular bootstrap failed:", err instanceof Error ? err.stack : String(err));
});
