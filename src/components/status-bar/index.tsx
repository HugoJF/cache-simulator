import {clsx} from "clsx";
import {BigNumber} from "../big-number.tsx";
import {BigIntToHex} from "../big-int-to-hex.tsx";
import {formatPercentage, formatTimeFromNs} from "../../helpers/number.ts";
import {CacheAccess} from "../../cache/cache-access.ts";
import {CacheSimulator} from "../../cache/cache-simulator.ts";

export type StatusBarProps = {
    cache: CacheSimulator;
    history: CacheAccess;
    cycle: number;
    instructions: bigint[];
}
export const StatusBar = ({cache, history, cycle, instructions}: StatusBarProps) => {
    const hitRate = Number(cache.hits) / Number(cache.reads);
    const missRate = 1 - hitRate;
    const averageAccessTime = Number(cache.parameters.hitTime) + Number(cache.parameters.missPenalty) * missRate

    return <div
        className={clsx('flex py-2 gap-4 justify-center', {
            'bg-red-500': cycle === history.cycle && history.setAccess.replacementReason,
            'bg-green-500': cycle === history.cycle && !history.setAccess.replacementReason,
            'bg-gray-200': cycle !== history.cycle,
        })}
    >
        {/*TODO experiment with Statistic*/}
        <BigNumber
            key="level"
            value={cache.getLevel().toString()}
            description="Level"
        />
        <BigNumber
            key="cycle"
            value={history.cycle}
            description="Cycle"
        />
        <BigNumber
            key="address"
            value={<BigIntToHex value={history.setAccess.address}/>}
            description="Address"
        />
        <BigNumber
            key="set"
            value={String(history.setIndex)}
            description="Set"
        />
        <BigNumber
            key="block"
            value={String(history.setAccess.replacedIndex)}
            description="Block index"
        />
        <BigNumber
            key="tag"
            value={formatPercentage(hitRate)}
            description="Hit-rate"
        />
        <BigNumber
            key="tag"
            value={formatTimeFromNs(averageAccessTime)}
            description="Average access time"
        />
        <BigNumber
            key="instruction"
            value={`${cycle + 1}/${instructions.length}`}
            description="Instructions"
        />
        <BigNumber
            key="result"
            value={history.setAccess.replacementReason ? 'MISS' : 'HIT'}
            description="Result"
        />
    </div>
}
