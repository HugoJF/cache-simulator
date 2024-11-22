import {clsx} from "clsx";
import {BigNumber} from "../big-number.tsx";
import {formatPercentage, formatTimeFromNs} from "../../helpers/number.ts";
import {CacheAccess} from "../../cache/cache-access.ts";
import {CacheSimulator} from "../../cache/cache-simulator.ts";
import {Serialized} from "../serializers/serialized.tsx";

export type StatusBarProps = {
    cache: CacheSimulator;
    history: CacheAccess;
    cycle: number;
    instructions: bigint[];
}
export const StatusBar = ({cache, history, cycle}: StatusBarProps) => {
    const hitRate = Number(cache.hits) / Number(cache.reads);
    const missRate = 1 - hitRate;
    const averageAccessTime = Number(cache.parameters.hitTime) + Number(cache.parameters.missPenalty) * missRate

    return <div
        className={clsx({
            'bg-red-500': cycle === history.cycle && history.setAccess.replacementReason,
            'bg-green-500': cycle === history.cycle && !history.setAccess.replacementReason,
            'bg-gray-200 opacity-20': cycle !== history.cycle,
        })}
    >
        <div className="mx-auto container flex py-2 gap-8">
            <h2
                className={clsx('px-2 py-1 text-lg font-bold font-mono self-center border rounded-lg', {
                    'border-black': true,
                })}
            >
                L{cache.getLevel().toString()} CACHE
            </h2>
            <BigNumber
                key="tag"
                description="Tag"
                value={
                    <Serialized.Address
                        value={history.setAccess.address.tag}
                        padStartLength={9}
                        padStart="0"
                    />
                }
            />
            <BigNumber
                key="set"
                description="Set"
                value={String(history.setIndex)}
            />
            <BigNumber
                key="block"
                description="Block index"
                value={String(history.setAccess.replacedIndex)}
            />
            <BigNumber
                key="hot-rate"
                description="Hit-rate"
                value={formatPercentage(hitRate)}
            />
            <BigNumber
                key="average-access-time"
                description="Average access time"
                value={formatTimeFromNs(averageAccessTime)}
            />
            <BigNumber
                key="result"
                description="Result"
                value={history.setAccess.replacementReason ? 'MISS' : 'HIT'}
            />
        </div>
    </div>
}
