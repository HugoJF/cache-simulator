export interface CacheBlockAccess {
    readonly hit: boolean,
    readonly data: bigint,
    readonly address: bigint,
}
