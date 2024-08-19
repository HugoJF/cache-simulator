import {Address} from "../cache/address.ts";
import {CacheParameters} from "../cache/cache-parameters.ts";
import {log2} from "./bigint.ts";

export const bitMask = (bits: bigint, offset: bigint) => {
    return (1n << bits) - 1n << offset;
}

export const bitExtract = (address: bigint, bits: bigint, offset: bigint) => {
    const mask = bitMask(bits, offset);

    return (address & mask) >> offset;
}

export const bigintToAddress = (parameters: CacheParameters, address: bigint): Address => {
    const offset = bitExtract(address, log2(parameters.wordsPerBlock), 0n);
    const index = bitExtract(address, log2(parameters.sets), log2(parameters.wordsPerBlock));
    // TODO we need address size
    const tag = bitExtract(address, 64n - log2(parameters.wordsPerBlock) - log2(parameters.sets), log2(parameters.sets) + log2(parameters.wordsPerBlock));

    return new Address(address, tag, index, offset);
}
