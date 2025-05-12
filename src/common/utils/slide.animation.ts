import {
    animate,
    animateChild,
    animation,
    AnimationReferenceMetadata,
    AnimationTriggerMetadata,
    group,
    query,
    style,
    transition,
    trigger,
} from "@angular/animations";

export const slideLeft: AnimationReferenceMetadata = animation([
    query(":enter", [style({ transform: "translate3d(-100%, 0, 0)" })], { optional: true }),
    query(":leave", [style({ transform: "none", position: "absolute" })], { optional: true }),
    group([
        query(
            ":leave",
            [animate("0.5s cubic-bezier(0.35, 0, 0.25, 1)", style({ transform: "translate3d(100%, 0, 0)" }))],
            { optional: true },
        ),
        query(
            ":enter",
            [
                animate("0.5s cubic-bezier(0.35, 0, 0.25, 1)", style({ transform: "none" })),
                query("@*", animateChild({ duration: 0.01 }), { optional: true }),
            ],
            {
                optional: true,
            },
        ),
    ]),
]);

export const slideRight: AnimationReferenceMetadata = animation([
    query(":enter", [style({ transform: "translate3d(100%, 0, 0)" })], { optional: true }),
    query(":leave", [style({ transform: "none", position: "absolute" })], { optional: true }),
    group([
        query(
            ":leave",
            [
                animate(
                    "0.5s cubic-bezier(0.35, 0, 0.25, 1)",
                    style({ transform: "translate3d(-100%, 0, 0)" }),
                ),
            ],
            { optional: true },
        ),
        query(
            ":enter",
            [
                animate("0.5s cubic-bezier(0.35, 0, 0.25, 1)", style({ transform: "none" })),
                query("@*", animateChild({ duration: 0.01 }), { optional: true }),
            ],
            {
                optional: true,
            },
        ),
    ]),
]);

/**
 * Slide in vertically animation trigger with optional params
 *
 * @param params An object that encapsulates the child animation data where time is the animation duration in seconds
 * and transform is the translateY value in pixels. Default value is 0.1 for time and 0 for translateY value. Positive value
 * slides in from the bottom, negative from the top.
 * @param stateChangeExpr The state change expression. Default is ":enter"
 */
export function slideInVertical(
    params: { time: number; transform: number } = { time: 0.1, transform: 0 },
    stateChangeExpr: string = ":enter",
): AnimationTriggerMetadata {
    return trigger("slideInVertical", [
        transition(
            stateChangeExpr,
            animation(
                [
                    style({
                        position: "absolute",
                        transform: "translateY({{ transform }}px)",
                    }),
                    animate("{{ time }}s cubic-bezier(0.0, 0.0, 0.2, 1)", style({ transform: "*" })),
                ],
                {
                    params,
                },
            ),
        ),
    ]);
}

/**
 * Slide out vertically animation trigger with optional params
 *
 * @param params An object that encapsulates the child animation data where time is the animation duration in seconds
 * and transform is the translateY value in pixels. Default value is 0.1 for time and 0 for translateY value. Positive value
 * slides out to the bottom, negative to the top.
 * @param stateChangeExpr The state change expression. Default is ":leave"
 */
export function slideOutVertical(
    params: { time: number; transform: number } = { time: 0.1, transform: 0 },
    stateChangeExpr: string = ":leave",
): AnimationTriggerMetadata {
    return trigger("slideOutVertical", [
        transition(
            stateChangeExpr,
            animation(
                [
                    style({ position: "absolute", transform: "*" }),
                    animate(
                        "{{ time }}s cubic-bezier(0.0, 0.0, 0.2, 1)",
                        style({ transform: "translateY({{ transform }}px)" }),
                    ),
                ],
                {
                    params,
                },
            ),
        ),
    ]);
}
