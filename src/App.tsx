import './App.css'
import {useMemo, useReducer, useState} from 'react'
import {Header} from "./components/header.tsx";
import useInterval from "use-interval";
import CacheAccessHistory from "./components/cache-access-history.tsx";
import CacheState from "./components/cache-state.tsx";
import {StatusBar} from "./components/status-bar";
import {FileManagerModal} from "./components/file-manager-modal";
import {SettingsModal} from "./components/settings-modal";
import {CacheRunner} from "./cache/cache-runner.ts";
import {Tabs} from "antd";
import {usePrograms} from "./contexts/programs.tsx";
import {useCaches} from "./contexts/caches.tsx";
import {Empty} from "./components/empty";

function App() {
    // re-render function hook
    const {programs} = usePrograms();
    const {caches} = useCaches();

    const [resetToken, reset] = useReducer((x) => x + 1, 0);
    const [, rerender] = useReducer((x) => x + 1, 0);

    const [programIndex, _setProgramIndex] = useState(Object.keys(programs)[0]);
    const [cacheIndex, _setCacheIndex] = useState(0);

    const [selectedCacheIndex, setSelectedCacheIndex] = useState(0);

    function setProgramIndex(programIndex: string) {
        _setProgramIndex(programIndex);
        setSelectedCacheIndex(0);
    }

    function setCacheIndex(cacheIndex: number) {
        _setCacheIndex(cacheIndex);
        setSelectedCacheIndex(0);
    }

    const [running, setRunning] = useState(false);

    const [fileManagerOpen, setFileManagerOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const program = programs[programIndex];
    const parameters = caches[cacheIndex];

    const instructions = useMemo(() => {
        return program.map(log => BigInt(log))
    }, [program]);

    const runner = useMemo(() => {
        return new CacheRunner(parameters, instructions);
    }, [parameters, instructions, resetToken])

    function step() {
        rerender();
        runner.step();

        return true
    }

    async function fastForward() {
        rerender();
        runner.run();
    }

    useInterval(() => {
        if (instructions.length > 0) {
            step();
        }
    }, running ? 1000 : null);


    return <>
        <Header
            playing={running}
            onFileManagerClick={() => setFileManagerOpen(true)}
            onCacheChange={(cacheIndex) => {
                setCacheIndex(cacheIndex);
            }}
            onProgramChange={(programIndex) => {
                setProgramIndex(programIndex);
            }}
            onSettingsClick={() => setSettingsOpen(true)}
            onResetClick={() => {
                reset();
            }}
            onStepClick={step}
            onFastForwardClick={fastForward}
            onPlayClick={() => setRunning(!running)}
        />
        <FileManagerModal
            open={fileManagerOpen}
            onClose={() => setFileManagerOpen(false)}
        />
        <SettingsModal
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
        />

        {runner.caches.map((_, index) => (
            runner.getLastHistoryFromLevel(index) && <StatusBar
              key={index}
              cache={runner.caches[index]}
              history={runner.getLastHistoryFromLevel(index)!}
              cycle={runner.lastSimulatedCycle}
              instructions={instructions}
            />
        ))}

        <main className="pt-4 container mx-auto">
            {Boolean(runner.buildHistory(0, 1)?.length) && <Tabs
                defaultActiveKey={String(0)}
                onChange={key => setSelectedCacheIndex(Number(key))}
                items={runner.caches.map((cache) => ({
                    label: `L${cache.getLevel()} Cache`,
                    key: String(cache.getLevel() - 1),
                }))}
            />}

            {!runner.buildHistory(0, 1)?.length && <Empty/>}

            {/*{runner.caches.map(cache => <ParameterVisualizer parameters={cache.parameters}/>)}*/}

            <div className="flex gap-4">
                <div className="flex-grow">
                    <CacheState
                        cache={runner.caches[selectedCacheIndex]}
                        highlight={runner.getLastHistoryFromLevel(selectedCacheIndex) ? {
                            hit: !runner.getLastHistoryFromLevel(selectedCacheIndex)!.setAccess.replacementReason,
                            setIndex: runner.getLastHistoryFromLevel(selectedCacheIndex)!.setIndex,
                            blockIndex: runner.getLastHistoryFromLevel(selectedCacheIndex)!.setAccess.replacedIndex,
                        } : undefined}
                    />
                </div>
                <div className="w-[20rem]">
                    <CacheAccessHistory history={runner.buildHistory(selectedCacheIndex, 10) ?? []}/>
                </div>
            </div>
        </main>
    </>
}

export default App
