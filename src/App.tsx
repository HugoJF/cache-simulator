import {useMemo, useState} from 'react'
import './App.css'
import {bigintToAddress} from "./helpers/address.ts";
import {CacheParameters} from "./cache/cache-parameters.ts";
import {CacheSimulator} from "./cache/cache-simulator.ts";
import {Memory} from "./cache/memory.ts";
import {PowerOf2Input} from "./components/power-of-2-input.tsx";
import {Select, UploadProps} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
import {RcFile} from "antd/lib/upload";

const ARCH = 64n;

function App() {
    const [program, setProgram] = useState<any[]>([]);
    const [files, setFiles] = useState<RcFile[]>([]);

    const [policy, setPolicy] = useState('LRU')
    const [sets, setSets] = useState(128n);
    const [blocksPerSet, setBlocksPerSet] = useState(4n);
    const [wordsPerBlock, setWordsPerBlock] = useState(4n);

    const [initializationTime, setInitializationTime] = useState<number>();
    const [runTime, setRunTime] = useState<number>();

    const uploaderProps: UploadProps = {
        name: 'file',
        fileList: files,
        beforeUpload: async (file) => {
            setFiles([file])
            const raw = await file.text();
            setProgram(JSON.parse(raw))
        },
    };

    const cache = useMemo(() => {
        const log = console.log;
        // console.log = () => undefined;
        const initStart = Date.now();
        const instructions = program.map(log => BigInt(log.startAddress))
        const parameters = new CacheParameters(sets, blocksPerSet, wordsPerBlock, ARCH, policy as any);
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
    }, [program, policy, sets, blocksPerSet, wordsPerBlock])

    return (
        <>

            <a
                href="https://cache-simulator-tracergrind-parser.netlify.app/"
                target="_blank"
            >
                Text dump parser link
            </a>
            <Dragger {...uploaderProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Click or drag file to start parsing</p>
                <p className="ant-upload-hint">
                    Only TracerGrind texttrace dumps are supported!
                </p>
            </Dragger>
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
            <div>
                <span>capacity:</span>
                {Number(sets * blocksPerSet * wordsPerBlock * ARCH / 8n)} bytes
            </div>

            <h2>performance metrics ({files[0]?.name})</h2>
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
