import {SerializationType} from "../../contexts/settings.tsx";

export type SerializerProps = {
    value: bigint;
    serialization?: SerializationType;
}

type SerializationConfig = {
    radix: number;
    prefix?: string;
    suffix?: string;
}
const configs: Record<SerializationType, SerializationConfig> = {
    [SerializationType.HEXADECIMAL]: {radix: 16, prefix: '0x'},
    [SerializationType.DECIMAL]: {radix: 10},
    [SerializationType.BINARY]: {radix: 2, prefix: '0b'}
}

export const Serializer = ({value, serialization = SerializationType.HEXADECIMAL}: SerializerProps) => {
    const config = configs[serialization];

    return <>{config.prefix}{value.toString(config.radix).toUpperCase()}{config.suffix}</>
}