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
import {useSetting} from "./contexts/settings.tsx";

function App() {
    const [simulationLogs] = useSetting('simulationLogs');

    // re-render function hook
    const {programs} = usePrograms();
    const {caches, setCaches} = useCaches();

    const [resetToken, reset] = useReducer((x) => x + 1, 0);
    const [, rerender] = useReducer((x) => x + 1, 0);

    const [programIndex, _setProgramIndex] = useState(Object.keys(programs)[0]);
    const [cacheIndex, _setCacheIndex] = useState(0);

    const [selectedCacheLayer, setSelectedCacheLayer] = useState(0);

    function setProgramIndex(programIndex: string) {
        _setProgramIndex(programIndex);
        setSelectedCacheLayer(0);
    }

    function setCacheIndex(cacheIndex: number) {
        _setCacheIndex(cacheIndex);
        setSelectedCacheLayer(0);
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
        return new CacheRunner(parameters, instructions, {
            simulationLogs,
        });
    }, [simulationLogs, parameters, instructions, resetToken])

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
            caches={caches}
            selectedCacheIndex={cacheIndex}
            onCacheSelect={(index) => {
                setCacheIndex(index);
            }}
            onCacheUpdate={(cacheIndex, updatedCache) => {
                if (cacheIndex !== null) {
                    setCaches(caches.map((cache, index) => (
                        index === cacheIndex ? updatedCache : cache
                    )));
                } else {
                    setCaches([...caches, updatedCache]);
                }
            }}
            onCacheDelete={(index) => {
                setCaches(caches.filter((_, i) => i !== index));
                if (index === cacheIndex) {
                    setCacheIndex(0);
                }
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
              onChange={key => setSelectedCacheLayer(Number(key))}
              items={runner.caches.map((cache) => ({
                  label: `L${cache.getLevel()} Cache`,
                  key: String(cache.getLevel() - 1),
              }))}
            />}

            {!runner.buildHistory(0, 1)?.length && <Empty/>}

            <div className="flex gap-4">
                <div className="flex-grow">
                    <CacheState
                        cache={runner.caches[selectedCacheLayer]}
                        highlight={runner.getLastHistoryFromLevel(selectedCacheLayer) ? {
                            hit: !runner.getLastHistoryFromLevel(selectedCacheLayer)!.setAccess.replacementReason,
                            setIndex: runner.getLastHistoryFromLevel(selectedCacheLayer)!.setIndex,
                            blockIndex: runner.getLastHistoryFromLevel(selectedCacheLayer)!.setAccess.replacedIndex,
                        } : undefined}
                    />
                </div>
                <div className="w-[26rem]">
                    <CacheAccessHistory history={runner.buildHistory(selectedCacheLayer, 10) ?? []}/>
                </div>
            </div>
        </main>
    </>
}

export default App
