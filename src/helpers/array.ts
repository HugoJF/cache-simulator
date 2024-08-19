export const range = (from: number, to?: number) => {
    if (to === undefined) {
        to = from;
        from = 0;
    }

    return Array(to - from).fill(0);
}
