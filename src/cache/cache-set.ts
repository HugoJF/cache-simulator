import {Address} from "./address.ts";
import {range} from "../helpers/array.ts";
import {CacheSimulator} from "./cacheSimulator.ts";
import {CacheBlock} from "./cache-block.ts";
import {CacheSetAccess} from "./cache-set-access.ts";

export class CacheSet {
    blocks: CacheBlock[];

    constructor(private cache: CacheSimulator) {
        // TODO assert associativity is a power of 2
        this.blocks = range(Number(this.cache.parameters.blocksPerSet)).map(() => new CacheBlock(cache));
    }

    read(address: Address): CacheSetAccess {
        console.log(`Reading address 0x${address.raw.toString(16)} tags available: ${this.blocks.map(block => block.getTag())}`);
        const block = this.findBlockFromTag(address);

        if (!block) {
            console.log(`Block not found for address 0x${address.raw.toString(16)}`)
            const replacement = this.getReplacementBlock();
            const replacedTag = replacement.getTag();
            const access = replacement.read(address);

            return {
                data: access.data,
                replaced: true,
                replacedTag: replacedTag,
                tagsAvailable: this.blocks.map(block => block.getTag()),
                address: address.raw,
                blockAccess: access,
            }
        }

        console.log(`Block found for address 0x${address.raw.toString(16)}`)
        const access = block.read(address);

        return {
            data: access.data,
            replaced: false,
            replacedTag: null,
            tagsAvailable: this.blocks.map(block => block.getTag()),
            address: address.raw,
            blockAccess: access,
        }
    }

    write(address: Address, data: bigint) {
        const block = this.findBlockFromTag(address);

        // TODO figure out what happens here

        return block!.write(address, data);
    }

    private getReplacementBlock() {
        const invalidBlock = this.blocks.find(block => !block.valid);
        if (invalidBlock) {
            return invalidBlock;
        }

        // TODO implement policy
        return this.blocks[
            Math.floor(Math.random() * this.blocks.length)
            ];
    }

    private findBlockFromTag(address: Address) {
        const block = this.blocks.filter(block => block.valid).find(block => block.getTag() === address.tag);

        if (!block) {
            return undefined;
        }

        return block;
    }
}
