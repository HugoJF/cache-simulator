import {CacheSetAccess} from "./cache-set-access.ts";

export interface CacheAccess {
    readonly data: bigint,
    readonly setIndex: bigint,
    readonly setAccess: CacheSetAccess,
}
