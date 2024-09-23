import {CacheBlockAccess} from "./cache-block-access.ts";

export enum ReplacementReason {
    Uninitialized = "Uninitialized",
    Invalid = "Invalid",
    Lru = "LRU",
    Fifo = "FIFO",
    Unknown = "Unknown",
}

export interface CacheSetAccess {
    readonly replacementReason: ReplacementReason | null,
    readonly replacedTag: bigint | null,
    readonly replacedIndex: number,
    readonly address: bigint,
    readonly tagsAvailable: bigint[],
    readonly blockAccess: CacheBlockAccess,
}
