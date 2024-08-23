import {DataStore} from "./data-store.ts";
import {CacheParameters} from "./cache-parameters.ts";
import {CacheSet} from "./cache-set.ts";
import {assertNonFalsy} from "../helpers/assertions.ts";
import {Address} from "./address.ts";
import {CacheAccess} from "./cache-access.ts";
import {LazyArray} from "../lazy/array.ts";

export class CacheSimulator {
    sets: LazyArray<CacheSet>;

    cycle = 0n;

    reads = 0n;
    writes = 0n;
    hits = 0n;
    misses = 0n;

    constructor(
        public readonly parameters: CacheParameters,
        public readonly underlying: DataStore,
    ) {
        this.sets = new LazyArray(
            Number(parameters.sets),
            () => new CacheSet(this),
        )
    }

    getCycle() {
        return this.cycle;
    }

    getSetFromIndex(index: bigint): CacheSet {
        // TODO assert index is within bounds
        return this.sets.get(Number(index));
    }


    read(address: Address): CacheAccess {
        console.log(`Reading address 0x${address.raw.toString(16)} in set ${address.index}`);

        const set = this.getSetFromIndex(address.index);
        assertNonFalsy(set, `Set not found for index ${address.index}`);

        const access = set.read(address);

        return {
            data: access.data,
            setIndex: address.index,
            setAccess: access,
        }
    }


    write(): void {

    }
}
