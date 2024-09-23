import {Form, Modal, Select, Tabs, TabsProps} from "antd";
import {useEffect, useState} from "react";
import {Clock, ListRestart, Shuffle} from "lucide-react";
import {parametersToCapacity, parameterToHumanReadable} from "../../helpers/parameters.ts";
import {CacheParameters} from "../../cache/cache-parameters.ts";
import {formatCapacity, formatNumber} from "../../helpers/number.ts";
import {DynamicLogSlider} from "../dynamic-log-slider";
import {DynamicLogRadio} from "../dynamic-log-radio";

const defaultCache: CacheParameters = {
    sets: 32n,
    blocksPerSet: 2n,
    wordsPerBlock: 8n,
    wordSize: 64n,
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

    return (
        <>
            <Modal
                title={initialCaches ? 'Editing Cache Configuration' : 'Creating Cache Configuration'}
                open={open}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
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

                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={console.log}
                >
                    <Form.Item
                        label={`Number of sets: ${formatNumber(Number(currentCache.sets))}`}
                    >
                        <DynamicLogSlider
                            // TODO not BigInt conversion
                            max={10}
                            value={Number(currentCache.sets ?? 1)}
                            onChange={value => {
                                setCaches(caches.map((cache, i) => {
                                    if (i === selectedCache) {
                                        return {
                                            ...cache,
                                            sets: BigInt(value),
                                        }
                                    }
                                    return cache;
                                }))
                            }}
                            defaultValue={30}
                            tooltip={{open: false}}
                        />

                    </Form.Item>
                    <Form.Item
                        label={`Blocks per Set: ${formatNumber(Number(currentCache.blocksPerSet))}`}
                    >
                        <DynamicLogSlider
                            // TODO not BigInt conversion
                            max={5}
                            value={Number(currentCache.blocksPerSet ?? 1n)}
                            onChange={value => {
                                setCaches(caches.map((cache, i) => {
                                    if (i === selectedCache) {
                                        return {
                                            ...cache,
                                            blocksPerSet: BigInt(value),
                                        }
                                    }
                                    return cache;
                                }))
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
                                setCaches(caches.map((cache, i) => {
                                    if (i === selectedCache) {
                                        return {
                                            ...cache,
                                            wordsPerBlock: BigInt(value),
                                        }
                                    }
                                    return cache;
                                }))

                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Replacement Policy"
                    >
                        <Select
                            defaultValue="lru"
                            onChange={console.log}
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

                    <div className="bg-gray-100 px-4 py-4 rounded">
                        <h2 className="text-lg font-medium">Cache Hierarchy Overview</h2>
                        <ul className="my-1">
                            {caches.map((cache, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>L{index + 1} Cache:</span>
                                    <span>{parameterToHumanReadable(cache)}</span>
                                </li>
                            ))}
                        </ul>
                        <span className="font-medium">Total Capacity: {formatCapacity(parametersToCapacity(caches), 2)}</span>
                    </div>
                </Form>

            </Modal>
        </>
    );
}
