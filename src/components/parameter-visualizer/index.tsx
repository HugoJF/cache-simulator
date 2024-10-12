import {CacheParameters} from "../../cache/cache-parameters.ts";
import {range} from "../../helpers/number.ts";
import {Tooltip} from "antd";
import {clsx} from "clsx";

type ParameterVisualizerProps = {
    parameters: CacheParameters;
}

const Block = ({setIndex, blockIndex, wordsPerBlock}: {
    setIndex: number,
    blockIndex: number,
    wordsPerBlock: number
}) => {
    return <ul className="flex">
        <li
            className="flex items-center justify-center w-8 h-6 bg-blue-100 border rounded-l-lg"
            title={`Valid bit`}
        >V
        </li>
        <li
            className="flex items-center justify-center px-2 h-6 bg-green-100 border"
            title={`Valid bit`}
        >
            Tag
        </li>
        {range(0, Number(wordsPerBlock)).map(wordIndex => (
            <Tooltip title={`Set ${setIndex} Block ${blockIndex} Word ${wordIndex}`}>
                <li
                    className={clsx('flex items-center justify-center px-2 h-6 bg-gray-100 border cursor-pointer aspect-square', {
                        'rounded-r-lg': wordIndex === Number(wordsPerBlock) - 1
                    })}
                />
            </Tooltip>
        ))}
    </ul>
}

// TODO add DnD feature to reorder caches?
export const ParameterVisualizer = ({parameters}: ParameterVisualizerProps) => {
    return <div>
        <table>
            <thead>
            <tr>
                <th></th>
                {range(0, Number(parameters.blocksPerSet)).map(blockIndex => (
                    <th className="whitespace-nowrap">Block {blockIndex}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {range(0, Number(parameters.sets)).map(setIndex => (
                <tr>
                    <td className="whitespace-nowrap">Set {setIndex}</td>
                    {range(0, Number(parameters.blocksPerSet)).map(blockIndex => (
                        <td>
                            <Block
                                setIndex={setIndex}
                                blockIndex={blockIndex}
                                wordsPerBlock={Number(parameters.wordsPerBlock)}
                            />
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    </div>
}
