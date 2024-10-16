import {Form, Modal, Select} from "antd";
import {InfoIcon} from "lucide-react";
import {useSettings} from "../../contexts/settings.tsx";

export type SettingsModalProps = {
    open: boolean;
    onClose: () => void;
}

export const SettingsModal = ({open, onClose}: SettingsModalProps) => {
    const {settings, setSetting} = useSettings();
    // const [stepperInterval, setStepperInterval] = useState(30)

    const [form] = Form.useForm();

    return <>
        <Modal
            title="Settings modal"
            open={open}
            onCancel={onClose}
            cancelButtonProps={{hidden: true}}
            okButtonProps={{hidden: true}}
        >
            <Form
                form={form}
                layout="vertical"
                onValuesChange={console.log}
            >
                <Form.Item
                    label="Console simulation logs"
                    help="Simulation generates huge amounts of logs and may slow down the browser. Disable for better performance."
                >
                    <Select
                        defaultValue={String(settings.simulationLogs)}
                        onChange={value => {
                            setSetting('simulationLogs', value === 'true');
                        }}
                        options={[
                            {
                                value: 'true', label: "Enabled",
                            }, {
                                value: 'false', label: "Disabled",
                            },
                        ]}
                    />
                </Form.Item>
                {/*<Form.Item*/}
                {/*    label="Option 1"*/}
                {/*>*/}
                {/*    <Select*/}
                {/*        defaultValue="opt1"*/}
                {/*        onChange={console.log}*/}
                {/*        options={[*/}
                {/*            {*/}
                {/*                value: 'opt1', label: "Option 1",*/}
                {/*            }, {*/}
                {/*                value: 'opt2', label: "Option 2",*/}
                {/*            }, {*/}
                {/*                value: 'opt3', label: "Option 3",*/}
                {/*            },*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*</Form.Item>*/}
                {/*<Form.Item*/}
                {/*    label="Option 1"*/}
                {/*>*/}
                {/*    <Select*/}
                {/*        defaultValue="opt1"*/}
                {/*        onChange={console.log}*/}
                {/*        options={[*/}
                {/*            {*/}
                {/*                value: 'opt1', label: "Option 1",*/}
                {/*            }, {*/}
                {/*                value: 'opt2', label: "Option 2",*/}
                {/*            }, {*/}
                {/*                value: 'opt3', label: "Option 3",*/}
                {/*            },*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*</Form.Item>*/}
                {/*<Form.Item*/}
                {/*    label={`Auto-stepper interval: ${formatTimeFromNs(Number(stepperInterval))}`}*/}
                {/*>*/}
                {/*    <DynamicLogSlider*/}
                {/*        // TODO not BigInt conversion*/}
                {/*        max={10}*/}
                {/*        value={Number(stepperInterval)}*/}
                {/*        onChange={value => {*/}
                {/*            setStepperInterval(value);*/}
                {/*        }}*/}
                {/*        defaultValue={30}*/}
                {/*        tooltip={{open: false}}*/}
                {/*    />*/}

                {/*</Form.Item>*/}
                {/*<Form.Item*/}
                {/*    label="Address serialization format"*/}
                {/*>*/}
                {/*    <Select*/}
                {/*        defaultValue="hex"*/}
                {/*        onChange={console.log}*/}
                {/*        options={[*/}
                {/*            {*/}
                {/*                value: 'hex', label: "Hexadecimal",*/}
                {/*            }, {*/}
                {/*                value: 'octal', label: "Octal",*/}
                {/*            }, {*/}
                {/*                value: 'decimal', label: "Decimal",*/}
                {/*            }, {*/}
                {/*                value: 'binary', label: "Binary",*/}
                {/*            },*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*</Form.Item>*/}
            </Form>

            <div className="flex gap-2 px-4 py-4 bg-gray-100 rounded-lg">
                <InfoIcon/>
                <p>
                    <span>Need help generating new memory access logs? </span>
                    <a
                        className="underline text-blue-500"
                        target="_blank"
                        href="https://github.com/HugoJF/tracergrind-docker"
                    >Learn more about log generation</a>
                </p>
            </div>
        </Modal>
    </>
}
