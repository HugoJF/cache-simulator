import {useMemo, useState} from 'react'
import './App.css'
import {bigintToAddress} from "./helpers/address.ts";
import {CacheParameters} from "./cache/cache-parameters.ts";
import {logs} from "./inputs/strcmp.ts";
import {CacheSimulator} from "./cache/cache-simulator.ts";
import {Memory} from "./cache/memory.ts";
import {PowerOf2Input} from "./components/power-of-2-input.tsx";
import {Select} from "antd";

function App() {
    const [policy, setPolicy] = useState('LRU')
    const [sets, setSets] = useState(128n);
    const [blocksPerSet, setBlocksPerSet] = useState(4n);
    const [wordsPerBlock, setWordsPerBlock] = useState(4n);

    const [initializationTime, setInitializationTime] = useState<number>();
    const [runTime, setRunTime] = useState<number>();

    const cache = useMemo(() => {
        const log = console.log;
        // console.log = () => undefined;
        const initStart = Date.now();
        const instructions = logs.map(log => BigInt(log.startAddress))
        const parameters = new CacheParameters(sets, blocksPerSet, wordsPerBlock, 64n, policy as any);
        const memory = new Memory();
        const cache = new CacheSimulator(parameters, memory);
        const initEnd = Date.now();
        setInitializationTime(initEnd - initStart);

        const runStart = Date.now();
        instructions.forEach(instruction => {
            cache.read(bigintToAddress(parameters, instruction));
        });
        const runEnd = Date.now();
        setRunTime(runEnd - runStart);

        console.log = log;

        return cache;
    }, [policy, sets, blocksPerSet, wordsPerBlock])

    return (
        <>
            <h2>cache parameters</h2>
            <div>
                <span>policy:</span>
                <Select
                    value={policy}
                    onChange={value => setPolicy(value)}
                    options={[
                        {label: 'LRU', value: 'LRU'},
                        {label: 'FIFO', value: 'FIFO'},
                        {label: 'Random', value: 'Random'},
                    ]}
                />
            </div>
            <div>
                <span>sets:</span>
                <PowerOf2Input
                    value={Number(sets)}
                    onChange={value => setSets(BigInt(value ?? 1))}
                />
            </div>
            <div>
                <span>blocks per set:</span>
                <PowerOf2Input
                    value={Number(blocksPerSet)}
                    onChange={value => setBlocksPerSet(BigInt(value ?? 1))}
                />
            </div>
            <div>
                <span>words per block:</span>
                <PowerOf2Input
                    value={Number(wordsPerBlock)}
                    onChange={value => setWordsPerBlock(BigInt(value ?? 1))}
                />
            </div>

            <h2>performance metrics (strcmp dump)</h2>
            <p>reads: {cache.reads.toString()}</p>
            <p>writes: {cache.writes.toString()}</p>
            <p>hits: {cache.hits.toString()}</p>
            <p>misses: {cache.misses.toString()}</p>
            <p>initialization: {initializationTime}ms</p>
            <p>runtime: {runTime}ms</p>
        </>
    )
}

export default App
