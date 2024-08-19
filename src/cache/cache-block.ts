import {CacheSimulator} from "./cache-simulator.ts";
import {Address} from "./address.ts";
import {range} from "../helpers/array.ts";
import {CacheBlockAccess} from "./cache-block-access.ts";

export class CacheBlock {
    valid = false; // TODO deal with this later

    tag: bigint;
    data: bigint[];

    constructor(private readonly cache: CacheSimulator) {
        this.tag = 0n;
        this.data = range(Number(cache.parameters.wordsPerBlock)).fill(0n);
    }

    getTag() {
        return this.tag;
    }

    read(address: Address): CacheBlockAccess {
        this.cache.reads++;

        if (this.valid && this.tag === address.tag) {
            this.cache.hits++;
            return {
                data: this.data[Number(address.offset)],
                hit: true,
                address: address.raw,
            }
        }

        this.cache.misses++;
        const underlyingData = this.cache.underlying.read(address);
        this.data[Number(address.offset)] = underlyingData;
        this.tag = address.tag;
        this.valid = true;

        return {
            data: underlyingData,
            hit: false,
            address: address.raw,
        }
    }

    write(address: Address, data: bigint) {
        this.cache.writes++;

        // TODO assert offset is within bounds
        const offset = Number(address.offset);

        this.data[offset] = data;
        // TODO implement write policies
        this.cache.underlying.write(address, data);
    }
}
