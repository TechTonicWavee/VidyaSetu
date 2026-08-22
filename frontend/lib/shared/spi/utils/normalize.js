import { clamp } from "./clamp";

export function normalize(actual, target, maxScore) {
    if (!target || target <= 0) {
        return 0;
    }

    return clamp((actual / target) * maxScore, 0, maxScore);
}