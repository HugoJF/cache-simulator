import {Address} from "./address.ts";
import {CacheSimulator} from "./cache-simulator.ts";
import {CacheBlock} from "./cache-block.ts";
import {CacheSetAccess} from "./cache-set-access.ts";
import {LazyArray} from "../lazy/array.ts";
import {assertNonFalsy} from "../helpers/assertions.ts";

export class CacheSet {
    blocks: LazyArray<CacheBlock>;

    constructor(private cache: CacheSimulator) {
        this.blocks = new LazyArray(
            Number(this.cache.parameters.blocksPerSet),
            () => new CacheBlock(cache),
        )
    }

    read(address: Address): CacheSetAccess {
        console.log(`Reading address 0x${address.raw.toString(16)} tags available: ${this.blocks.mapInitialized(block => block.getTag())}`);
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
                tagsAvailable: this.blocks.mapInitialized(block => block.getTag()),
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
            tagsAvailable: this.blocks.mapInitialized(block => block.getTag()),
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
        const uninitializedBlock = this.blocks.findUninitialized();
        if (uninitializedBlock) {
            return uninitializedBlock;
        }

        const invalidBlock = this.blocks.findInitialized(block => !block.valid);
        if (invalidBlock) {
            return invalidBlock;
        }

        // TODO implement policy
        const replacement = this.blocks.get(
            Math.floor(Math.random() * this.blocks.length),
        );
        assertNonFalsy(replacement, "Somehow we find a non-initialized block");
        return replacement as CacheBlock; // TODO type-guard
    }

    private findBlockFromTag(address: Address) {
        const block = this.blocks.findInitialized(block => (
            block.valid && block.getTag() === address.tag
        ));

        if (!block) {
            return undefined;
        }

        return block;
    }
}
