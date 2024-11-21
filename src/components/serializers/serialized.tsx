import {Serializer, SerializerProps} from "./serializer.tsx";
import {useSettings} from "../../contexts/settings.tsx";

const SerializedAddress = ({value, serialization}: SerializerProps) => {
    const {settings} = useSettings();

    return <Serializer value={value} serialization={serialization || settings.addressSerialization}/>
}
const SerializedTag = ({value, serialization}: SerializerProps) => {
    const {settings} = useSettings();

    return <Serializer value={value} serialization={serialization || settings.tagSerialization}/>
}
const SerializedIndex = ({value, serialization}: SerializerProps) => {
    const {settings} = useSettings();

    return <Serializer value={value} serialization={serialization || settings.indexSerialization}/>
}
const SerializedBlockOffset = ({value, serialization}: SerializerProps) => {
    const {settings} = useSettings();

    return <Serializer value={value} serialization={serialization || settings.blockOffsetSerialization}/>
}
const SerializedByteOffset = ({value, serialization}: SerializerProps) => {
    const {settings} = useSettings();

    return <Serializer value={value} serialization={serialization || settings.byteOffsetSerialization}/>
}

export const Serialized = {
    Address: SerializedAddress,
    Tag: SerializedTag,
    Index: SerializedIndex,
    BlockOffset: SerializedBlockOffset,
    ByteOffset: SerializedByteOffset,
}