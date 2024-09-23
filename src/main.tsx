import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {ConfigProvider} from "antd";
import {CachesProvider} from "./contexts/caches.tsx";
import {ProgramsProvider} from "./contexts/programs.tsx";

// TODO move ConfigProvider to App.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
    <ConfigProvider
        theme={{
            token: {
                fontFamily: 'Geist Sans',
                // colorPrimary: '#09090b'
            },
            components: {
                Select: {
                    // optionSelectedBg: '#d9d9d9',
                },
            },
        }}
    >
        <CachesProvider>
            <ProgramsProvider>
                <App/>
            </ProgramsProvider>
        </CachesProvider>
    </ConfigProvider>,
)
