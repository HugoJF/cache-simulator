import {DataStore} from "./data-store.ts";
import {Address} from "./address.ts";

export class Memory implements DataStore {
    data = new Map<bigint, bigint>();

    readCount = 0;
    writeCount = 0;

    read(address: Address): bigint {
        this.readCount++;

        return this.data.get(address.raw) || BigInt(0);
    }

    write(address: Address, value: bigint): void {
        this.writeCount++;

        this.data.set(address.raw, value);
    }
}
