import {CacheBlockAccess} from "./cache-block-access.ts";

export interface CacheSetAccess {
    readonly replaced: boolean,
    readonly replacedTag: bigint | null,
    readonly data: bigint,
    readonly address: bigint,
    readonly tagsAvailable: bigint[],
    readonly blockAccess: CacheBlockAccess,
}
