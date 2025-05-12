import { transition, trigger, useAnimation } from "@angular/animations";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";

import { slideInVertical, slideLeft, slideOutVertical, slideRight } from "../common/utils/slide.animation";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet],
    animations: [
        trigger("routeAnimations", [
            transition(":increment", useAnimation(slideLeft)),
            transition(":decrement", useAnimation(slideRight)),
        ]),
        slideOutVertical({
            time: 0.5,
            transform: 70,
        }),
        slideInVertical({
            time: 0.5,
            transform: -70,
        }),
    ],
})
export class AppComponent {
    constructor(private matIconReg: MatIconRegistry) {
        this.matIconReg.setDefaultFontSetClass("material-symbols-sharp");
    }
}
