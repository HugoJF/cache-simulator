import {CacheParameters} from "../../cache/cache-parameters.ts";
import {range} from "../../helpers/number.ts";
import {Tooltip} from "antd";

type ParameterVisualizerProps = {
    parameters: CacheParameters;
}

// TODO add DnD feature to reorder caches?
export const ParameterVisualizer = ({parameters}: ParameterVisualizerProps) => {
    return (
        <div>
            <ul className="flex flex-col gap-1 text-xs font-mono">
                {range(0, Number(parameters.sets)).map((setIndex) => (<li>
                    <ul className="flex gap-2">
                        <span className="w-12">Set {setIndex + 1}</span>
                        {range(0, Number(parameters.blocksPerSet)).map((blockIndex) => (<li
                            title={`Block ${blockIndex}`}
                        >
                            <ul className="flex">
                                <li
                                    className="flex items-center justify-center w-8 h-8 bg-blue-100 border"
                                    title={`Valid bit`}
                                >V
                                </li>
                                <li
                                    className="flex items-center justify-center px-2 h-8 bg-green-100 border"
                                    title={`Valid bit`}
                                >
                                    Tag
                                </li>
                                {range(0, Number(parameters.wordsPerBlock)).map(wordIndex => (
                                    <Tooltip title={`Set ${setIndex} Block ${blockIndex} Word ${wordIndex}`}>
                                        <li
                                            className="flex items-center justify-center px-2 h-8 bg-gray-100 border cursor-pointer"
                                        >
                                            W{wordIndex}
                                        </li>
                                    </Tooltip>
                                ))}
                            </ul>
                        </li>))}
                    </ul>
                </li>))}
            </ul>
        </div>
    );
}
