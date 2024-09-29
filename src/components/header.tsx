import {FC, useState} from "react";
import {ArrowArcRight, ArrowsCounterClockwise, FastForward, Gear, Pause, Play} from "@phosphor-icons/react";
import {Button, Dropdown, Select, Tooltip} from "antd";
import {parametersToHumanReadable} from "../helpers/parameters.ts";
import {CacheParameters} from "../cache/cache-parameters.ts";
import {Pencil, Plus, Trash} from "lucide-react";
import {ConfiguratorModal} from "./configurator-modal";
import {useCaches} from "../contexts/caches.tsx";
import {clsx} from "clsx";
import {usePrograms} from "../contexts/programs.tsx";

type IconProps = {
    disabled?: boolean,
    icon: typeof Gear,
    description: string,
    onClick?: () => void
}

function Icon({icon: Icon, description, disabled = false, ...rest}: IconProps) {
    return <Tooltip title={description}>
        <Icon
            size={54}
            className={clsx('px-2 py-3 select-none', {
                'cursor-pointer hover:bg-gray-800': !disabled,
                'text-gray-500': disabled,
            })}
            {...rest}
        />
    </Tooltip>
}

type Props = {
    playing: boolean;

    onFileManagerClick: () => void;

    onCacheChange: (cacheIndex: number) => void;
    onProgramChange: (programName: string) => void;

    onSettingsClick: () => void;
    onResetClick: () => void;
    onFastForwardClick: () => void;
    onStepClick: () => void;
    onPlayClick: () => void;

}
export const Header: FC<Props> = ({
    playing,
    onFileManagerClick,
    onCacheChange,
    onProgramChange,
    onSettingsClick,
    onResetClick,
    onFastForwardClick,
    onStepClick,
    onPlayClick,
}) => {
    const {caches, setCaches} = useCaches();
    const {programs} = usePrograms();
    const [configuratorVisible, setConfiguratorVisible] = useState(false);

    const [selectedCacheKey, setSelectedCacheKey] = useState<string>("0");
    const [modalCache, setModalCache] = useState<CacheParameters[] | undefined>();

    // TODO move the entire logic outside this component
    const selectedCacheIndex = Number(selectedCacheKey);
    const selectedCache = caches[selectedCacheIndex];

    function handleConfigurationSubmit(newCache: CacheParameters[]) {
        if (modalCache) {
            setCaches(caches.map((cache, index) => index === selectedCacheIndex ? newCache : cache));
        } else {
            setCaches([...caches, newCache]);
        }
    }

    return <>
        <ConfiguratorModal
            initialCaches={modalCache}
            open={configuratorVisible}
            onCreate={handleConfigurationSubmit}
            onClose={() => setConfiguratorVisible(false)}
        />
        <header className="flex pl-4 gap-8 items-center bg-gray-900 text-white">
            <h1 className="font-black uppercase">CacheSim</h1>
            <div className="flex-grow flex gap-4">
                <Tooltip title="Cache configuration">
                    <Select
                        popupMatchSelectWidth={false}
                        defaultValue={selectedCacheKey}
                        onChange={key => {
                            const index = Number(key);
                            onCacheChange(index);
                            setSelectedCacheKey(key);
                        }}
                        options={caches.map((config, index) => ({
                            value: String(index),
                            label: parametersToHumanReadable(config),
                        }))}
                    />
                </Tooltip>

                <Dropdown
                    menu={{
                        items: [{
                            type: 'group',
                            label: 'Actions',
                        }, {
                            type: 'divider',
                        }, {
                            key: 'add',
                            label: 'Create new',
                            icon: <Plus size={16}/>,
                            onClick: () => {
                                setConfiguratorVisible(true)
                                setModalCache(undefined);
                            },
                        }, {
                            key: 'edit',
                            label: 'Edit selected',
                            icon: <Pencil size={16}/>,
                            onClick: () => {
                                setConfiguratorVisible(true)
                                setModalCache(selectedCache);
                            },
                        }, {
                            key: 'delete',
                            label: 'Delete selected',
                            icon: <Trash size={16}/>,
                            onClick: () => {
                                // TODO implement deletion
                            },
                        }],
                    }}
                    trigger={['click']}
                    placement="bottom"
                >
                    <Button icon={<Gear size={16}/>}>
                        Manage
                    </Button>
                </Dropdown>
                <Tooltip title="Program to simulate">
                    <Select
                        popupMatchSelectWidth={false}
                        defaultValue={Object.keys(programs)[0]}
                        onChange={programName => {
                            onProgramChange(programName);
                        }}
                        options={Object.keys(programs).map(name => ({
                            value: name,
                            label: name,
                        }))}
                    />
                </Tooltip>
                <Button
                    onClick={onFileManagerClick}
                    icon={<Gear size={16}/>}
                >
                    Manage
                </Button>
            </div>

            <div className="flex justify-self-end">
                <Icon
                    icon={Gear}
                    description="Simulation settings"
                    onClick={onSettingsClick}
                />
                <Icon
                    icon={ArrowsCounterClockwise}
                    description="Reset cache"
                    onClick={onResetClick}
                />
                <Icon
                    icon={FastForward}
                    description="Fast-forward entire program"
                    onClick={onFastForwardClick}
                />
                <Icon
                    icon={ArrowArcRight}
                    description="Run single instruction"
                    onClick={onStepClick}
                />

                {playing ?
                    <Icon
                        icon={Pause}
                        description="Pause auto-stepper"
                        onClick={onPlayClick}
                    />
                    :
                    <Icon
                        icon={Play}
                        description="Resume auto-stepper"
                        onClick={onPlayClick}
                    />
                }
            </div>
        </header>
    </>
}
