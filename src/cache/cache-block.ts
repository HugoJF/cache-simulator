import {CacheSimulator} from "./cache-simulator.ts";
import {Address} from "./address.ts";
import {CacheBlockAccess} from "./cache-block-access.ts";

export class CacheBlock {
    valid = false; // TODO deal with this later

    tag: bigint;
    data: bigint[];

    lastAccessedAt = 0n;
    readAt = 0n;

    constructor(private readonly cache: CacheSimulator) {
        this.tag = 0n;
        this.data = [];
    }

    getTag() {
        return this.tag;
    }

    read(address: Address): CacheBlockAccess {
        this.cache.reads++;

        if (this.valid && this.tag === address.tag) {
            this.cache.hits++;
            this.lastAccessedAt = this.cache.getCycle();
            return {
                data: this.data[Number(address.offset)],
                hit: true,
                address: address.raw,
            }
        }

        this.cache.misses++;
        const underlyingData = this.cache.underlying.read(address);
        this.readAt = this.cache.getCycle();
        // TODO read more data
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
