import {Address} from "../cache/address.ts";
import {CacheParameters} from "../cache/cache-parameters.ts";
import {log2n} from "./bigint.ts";
import {ADDRESS_SIZE} from "../constants/arch.ts";
import {CacheBlock} from "../cache/cache-block.ts";

export const bitMask = (bits: bigint, offset: bigint) => {
    return (1n << bits) - 1n << offset;
}

export const bitExtract = (address: bigint, bits: bigint, offset: bigint) => {
    const mask = bitMask(bits, offset);

    return (address & mask) >> offset;
}

export const bigintToAddress = (parameters: CacheParameters, address: bigint): Address => {
    const offsetSize = log2n(parameters.wordsPerBlock);
    const indexSize = log2n(parameters.sets);
    const tagShift = offsetSize + indexSize;

    const offset = bitExtract(address, offsetSize, 0n);
    const index = bitExtract(address, indexSize, offsetSize);
    const tag = bitExtract(address, ADDRESS_SIZE - tagShift, tagShift);

    return new Address(address, tag, index, offset);
}

export const blockAddressRange = (parameters: CacheParameters, block: CacheBlock) => {
    const offsetSize = log2n(parameters.wordsPerBlock);
    const indexSize = log2n(parameters.sets);

    const baseAddress = block.tag << (offsetSize + indexSize) + BigInt(block.index) << offsetSize;
    const endAddress = baseAddress + parameters.wordsPerBlock;

    return [baseAddress, endAddress - 1n];
}
