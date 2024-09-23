export const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
}

export const numberToSuffixed = (value: number) => {
    const units = [null, 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    let unitIndex = 0;
    let remaining = value;
    while (remaining >= 1024 && unitIndex < units.length - 1) {
        remaining /= 1024;
        unitIndex++;
    }
    return [remaining, units[unitIndex]] as const;

}

export const formatNumber = (value: number, decimals = 0) => {
    const [remaining, unit] = numberToSuffixed(value);

    return `${remaining.toFixed(decimals)} ${unit ?? ''}`
}

export const formatCapacity = (value: bigint, decimals = 0) => {
    const [remaining, unit] = numberToSuffixed(Number(value));
    return `${remaining.toFixed(decimals)} ${unit ?? 'bytes'}B`;
}

// TODO this can be improved greatly
const timeUnits = ['ns', 'us', 'ms', 's'] as const;
export const formatTimeFromNs = (value: number) => {
    let remaining = value;
    let unitIndex = 0;
    while (remaining >= 1000 && unitIndex < timeUnits.length - 1) {
        remaining /= 1000;
        unitIndex++;
    }
    return `${remaining} ${timeUnits[unitIndex]}`;
}

export const range = (start: number, end: number, inclusive = false) => {
    const inclusiveFix = inclusive ? 1 : 0;
    return Array(end - start + inclusiveFix).fill(0).map((_, index) => index + start);
}