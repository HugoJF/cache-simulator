import {Address} from "./address.ts";

export abstract class DataStore {
    abstract read(address: Address): bigint;
    abstract write(address: Address, value: bigint): void;
}
