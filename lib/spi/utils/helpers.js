export function safeDivide(numerator, denominator) {
    if (!denominator || denominator === 0) {
        return 0;
    }

    return numerator / denominator;
}

export function daysSince(date) {
    if (!date) {
        return Infinity;
    }

    const now = new Date();
    const then = new Date(date);

    return Math.floor(
        (now - then) / (1000 * 60 * 60 * 24)
    );
}

export function roundToTwo(value) {
    return Number(value.toFixed(2));
}