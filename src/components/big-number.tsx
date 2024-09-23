import {ReactNode} from "react";

export type BigNumberProps = {
    value: ReactNode;
    description: string;
}
export const BigNumber = ({value, description}: BigNumberProps) => {
    return <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold">{value}</h3>
        <span className="text-sm uppercase">{description}</span>
    </div>
}
