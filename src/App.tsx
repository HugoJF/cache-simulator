import './App.css'
import {useMemo, useReducer, useState} from 'react'
import {CacheParameters} from "./cache/cache-parameters.ts";
import {Header} from "./components/header.tsx";
import useInterval from "use-interval";
import {CACHE_CONFIGURATIONS} from "./constants/configurations.ts";
import CacheAccessHistory from "./components/cache-access-history.tsx";
import CacheState from "./components/cache-state.tsx";
import {StatusBar} from "./components/status-bar";
import {FileManagerModal} from "./components/file-manager-modal";
import {SettingsModal} from "./components/settings-modal";
import {CacheRunner} from "./cache/cache-runner.ts";
import {PROGRAMS} from "./constants/programs.ts";
import {Tabs} from "antd";

function App() {
    // re-render function hook
    const [, rerender] = useReducer((x) => x + 1, 0);
    const [parameters, setParameters] = useState<CacheParameters[]>(CACHE_CONFIGURATIONS[0]);
    const [program, setProgram] = useState<string[]>(PROGRAMS["strcmp.out"]);
    const [cacheIndex, setCacheIndex] = useState(0);

    const [running, setRunning] = useState(false);

    const [fileManagerOpen, setFileManagerOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const instructions = useMemo(() => {
        return program.map(log => BigInt(log))
    }, [program]);

    const runner = useMemo(() => {
        return new CacheRunner(parameters, instructions);
    }, [parameters, instructions])

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
            onParametersChange={setParameters}
            onProgramChange={setProgram}
            onSettingsClick={() => setSettingsOpen(true)}
            onResetClick={() => setParameters([...parameters])}
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
            <Tabs
                defaultActiveKey={String(0)}
                type="card"
                onChange={key => setCacheIndex(Number(key))}
                items={runner.caches.map((cache) => ({
                    label: `L${cache.getLevel()} Cache`,
                    key: String(cache.getLevel() - 1),
                }))}
            />

            <div className="flex gap-4">
                <div className="flex-grow">
                    <CacheState
                        cache={runner.caches[cacheIndex]}
                        highlight={runner.getLastHistoryFromLevel(cacheIndex) ? {
                            hit: !runner.getLastHistoryFromLevel(cacheIndex)!.setAccess.replacementReason,
                            setIndex: runner.getLastHistoryFromLevel(cacheIndex)!.setIndex,
                            blockIndex: runner.getLastHistoryFromLevel(cacheIndex)!.setAccess.replacedIndex,
                        } : undefined}
                    />
                </div>
                <div className="w-[20rem]">
                    <CacheAccessHistory history={runner.buildHistory(cacheIndex, 10) ?? []}/>
                </div>
            </div>
        </main>
    </>
}

export default App
