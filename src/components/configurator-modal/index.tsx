import {Form, Modal, Select, Tabs, TabsProps} from "antd";
import {useEffect, useState} from "react";
import {Clock, Cpu, ListRestart, Shuffle, Zap} from "lucide-react";
import {parametersToCapacity, parameterToHumanReadable} from "../../helpers/parameters.ts";
import {CacheParameters} from "../../cache/cache-parameters.ts";
import {formatCapacity, formatNumber, formatTimeFromNs} from "../../helpers/number.ts";
import {DynamicLogSlider} from "../dynamic-log-slider";
import {DynamicLogRadio} from "../dynamic-log-radio";
import {ParameterVisualizer} from "../parameter-visualizer";

const defaultCache: CacheParameters = {
    sets: 32n,
    blocksPerSet: 2n,
    wordsPerBlock: 8n,
    wordSize: 64n,
    hitTime: 1n,
    missPenalty: 10n,
    policy: 'LRU',
};

type ConfiguratorModalProps = {
    initialCaches?: CacheParameters[];
    open: boolean;
    onCreate: (caches: CacheParameters[]) => void;
    onClose: () => void;
}

function getNewDefaultCache() {
    return {...defaultCache}
}


// TODO add DnD feature to reorder caches?
export const ConfiguratorModal = ({initialCaches, open, onCreate, onClose}: ConfiguratorModalProps) => {
    const [selectedCache, setSelectedCache] = useState(0)
    const [customCacheTiming, setCustomCacheTiming] = useState(false);
    const [caches, setCaches] = useState<CacheParameters[]>([getNewDefaultCache(), getNewDefaultCache()])

    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) {
            return;
        }

        if (initialCaches) {
            setCaches(initialCaches.map(cache => ({...cache})));
        } else {
            setCaches([getNewDefaultCache()])
        }
    }, [open]);

    function addCache() {
        setCaches([...caches, {...defaultCache}])
    }

    function removeCache(key: string) {
        setCaches(caches.filter((_, i) => i !== Number(key)))
    }

    const currentCache = caches[selectedCache];

    const handleCacheTabsEdit: TabsProps['onEdit'] = (event, action) => {
        if (action === 'add') {
            addCache()
        } else {
            if (typeof event !== 'string') {
                console.log(event)
                throw new Error('Was not expecting a non-string TabProps.onEdit remove event');
            }
            removeCache(event)
        }
    }

    const handleModalOk = () => {
        onCreate(caches)
        onClose();
    }

    const handleModalCancel = () => {
        onClose()
    }

    const updateCache = <T extends keyof CacheParameters>(
        cacheIndex: number,
        property: T,
        value: CacheParameters[T],
    ) => {
        setCaches(caches.map((cache, i) => {
            if (i !== cacheIndex) {
                return cache;
            }
            return {
                ...cache,
                [property]: value,
            }
        }))
    }

    return (
        <>
            <Modal
                title={initialCaches ? 'Editing Cache Configuration' : 'Creating Cache Configuration'}
                width="80%"
                open={open}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                maskClosable={false}
            >

                <Tabs
                    defaultActiveKey={String(selectedCache)}
                    type="editable-card"
                    size="small"
                    onChange={key => setSelectedCache(Number(key))}
                    onEdit={handleCacheTabsEdit}
                    items={caches.map((_, index) => ({
                        label: `L${index + 1} Cache`,
                        key: String(index),
                        closable: true,
                    }))}
                />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={console.log}
                        >
                            <Form.Item
                                label={`Number of sets: ${formatNumber(Number(currentCache.sets))}`}
                            >
                                <DynamicLogSlider
                                    max={10}
                                    value={Number(currentCache.sets ?? 1)}
                                    onChange={value => {
                                        updateCache(selectedCache, 'sets', BigInt(value))
                                    }}
                                    defaultValue={30}
                                    tooltip={{open: false}}
                                />

                            </Form.Item>
                            <Form.Item
                                label={`Blocks per Set: ${formatNumber(Number(currentCache.blocksPerSet))}`}
                            >
                                <DynamicLogSlider
                                    max={5}
                                    value={Number(currentCache.blocksPerSet ?? 1n)}
                                    onChange={value => {
                                        updateCache(selectedCache, 'blocksPerSet', BigInt(value))
                                    }}
                                    defaultValue={30}
                                    tooltip={{open: false}}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Words per Block"
                            >
                                <DynamicLogRadio
                                    min={0}
                                    value={Number(currentCache.wordsPerBlock)}
                                    onChange={value => {
                                        updateCache(selectedCache, 'wordsPerBlock', BigInt(value))
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Replacement Policy"
                            >
                                <Select
                                    defaultValue="lru"
                                    onChange={value => {
                                        updateCache(selectedCache, 'policy', value as 'LRU' | 'FIFO')
                                    }}
                                    options={[
                                        {
                                            value: 'lru', label: <div className="flex items-center gap-1">
                                                <Clock className="w-4"/>
                                                <span>LRU (Least Recently Used)</span>
                                            </div>,
                                        },
                                        {
                                            value: 'fifo',
                                            label: <div className="flex items-center gap-1">
                                                <ListRestart className="w-4"/>
                                                <span>FIFO (First In, First Out)</span>
                                            </div>,
                                        },
                                        {
                                            value: 'random',
                                            label: <div className="flex items-center gap-1">
                                                <Shuffle className="w-4"/>
                                                <span>Random</span>
                                            </div>,
                                        },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Cache Timing"
                            >
                                <Select
                                    defaultValue="simple"
                                    onChange={value => {
                                        setCustomCacheTiming(value === 'custom')
                                    }}
                                    options={[
                                        {
                                            value: 'simple', label: <div className="flex items-center gap-1">
                                                <Zap className="w-4"/>
                                                <span>Simple</span>
                                            </div>,
                                        },
                                        {
                                            value: 'custom',
                                            label: <div className="flex items-center gap-1">
                                                <Cpu className="w-4"/>
                                                <span>Custom</span>
                                            </div>,
                                        },
                                    ]}
                                />
                            </Form.Item>

                            {customCacheTiming && <>
                              <Form.Item
                                label={`Hit time: ${formatTimeFromNs(Number(currentCache.hitTime))}`}
                              >
                                <DynamicLogSlider
                                  max={5}
                                  value={Number(currentCache.hitTime ?? 1n)}
                                  onChange={value => {
                                      updateCache(selectedCache, 'hitTime', BigInt(value))
                                  }}
                                  defaultValue={30}
                                  tooltip={{open: false}}
                                />
                              </Form.Item>

                              <Form.Item
                                label={`Miss penalty: ${formatTimeFromNs(Number(currentCache.missPenalty))}`}
                              >
                                <DynamicLogSlider
                                  max={5}
                                  value={Number(currentCache.missPenalty ?? 1n)}
                                  onChange={value => {
                                      updateCache(selectedCache, 'missPenalty', BigInt(value))
                                  }}
                                  defaultValue={30}
                                  tooltip={{open: false}}
                                />
                              </Form.Item>
                            </>}

                            <div className="bg-gray-100 px-4 py-4 rounded">
                                <h2 className="text-lg font-medium">Cache Hierarchy Overview</h2>
                                <ul className="my-1">
                                    {caches.map((cache, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between"
                                        >
                                            <span>L{index + 1} Cache:</span>
                                            <span>{parameterToHumanReadable(cache)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <span className="font-medium">Total Capacity: {formatCapacity(parametersToCapacity(caches), 2)}</span>
                            </div>
                        </Form>
                    </div>
                    <div className="overflow-auto">
                        <ParameterVisualizer parameters={caches[selectedCache]}/>
                    </div>
                </div>
            </Modal>
        </>
    );
}
