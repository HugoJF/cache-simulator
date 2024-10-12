import {Modal} from "antd";
import {ParameterVisualizer} from "../parameter-visualizer";
import {ADDRESS_SIZE} from "../../constants/arch.ts";
import {MouseEvent, useRef, useState} from "react";

type ParameterVisualizerModalProps = {
    open: boolean;
    onClose: () => void;
}

const DEMO = {
    sets: 32n,
    blocksPerSet: 4n,
    wordsPerBlock: 2n,
    wordSize: ADDRESS_SIZE,
    hitTime: 1n,
    missPenalty: 10n,
    policy: 'LRU' as const,
}

export const ParameterVisualizerModal = ({open, onClose}: ParameterVisualizerModalProps) => {
    const isDragging = useRef(false);
    const last = useRef<{x: number, y: number}>();
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    function handleOnMouseLeave() {
        isDragging.current = false;
    }

    function handleOnMouseUp() {
        isDragging.current = false;
    }

    function handleOnMouseDown() {
        isDragging.current = true;
        last.current = undefined;
    }

    function handleOnMouseMove(event: MouseEvent<HTMLDivElement>) {
        if (!isDragging.current) {
            return
        }

        if (!last.current) {
            return last.current = {x: event.clientX, y: event.clientY}
        }

        const dx = event.clientX - last.current.x;
        const dy = event.clientY - last.current.y;
        last.current = {x: event.clientX, y: event.clientY}

        setTranslateX(translateX + dx);
        setTranslateY(translateY + dy);
    }


    return (
        <>
            <Modal
                title="Cache configuration visualizer"
                open={open}
                onCancel={onClose}
                cancelButtonProps={{hidden: true}}
                okButtonProps={{hidden: true}}
            >
                <div
                    className="aspect-square bg-gray-200 overflow-auto"
                    onMouseUp={handleOnMouseUp}
                    onMouseDown={handleOnMouseDown}
                    onMouseLeave={handleOnMouseLeave}
                    onMouseMove={handleOnMouseMove}
                >
                    <div
                        className="select-none"
                        style={{transform: `translate(${translateX}px, ${translateY}px)`}}
                    >
                        <ParameterVisualizer
                            parameters={DEMO}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}
