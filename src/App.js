import React, {useEffect, useMemo} from "react";
import {BrowserRouter} from "react-router-dom";
import Header from "./component/header/Header";
import {Box, ColorSchemeProvider} from "gestalt";
import PinModal from "./component/modals/pin_modal/PinModal";
import CustomSnackbar from "./component/CustomSnackbar";
import AppRoutes from "./routes/AppRoutes";
import GlobalStyle from "./styles/GlobalStyle";
import useAppState from "./hooks/useAppState";
import {redirectIfMobile} from "./utils/detectMobile";

function App() {

    /**
     * mode: recoil 상태 중 다크모드인지 아닌지를 판단하는 상태
     *       참이면 다크모드, 거짓이면 라이트모드
     * isPinOpen: recoil 상태 중 핀 모달이 열려있는지 아닌지를 판단하는 상태
     */
    const {mode, isPinOpen} = useAppState();

    /**
     * boxProps: Box 컴포넌트에 전달할 props
     * @type {{fit: boolean, color: string, minWidth: number}}
     * @description useMemo 를 사용하여 객체가 변하지 않는 이상 재생성되지 않도록 함
     */
    const boxProps = useMemo(() => ({
        fit: true,
        color: "default",
        minWidth: "800px"
    }), []);

    useEffect(() => {
        redirectIfMobile();
    }, []);

    return (
        // BrowserRouter 로 감싸주어 라우팅을 사용할 수 있도록 함
        <BrowserRouter>
            <ColorSchemeProvider colorScheme={mode ? "dark" : "light"}
                                 fullDimensions>
                <GlobalStyle darkMode={mode}/>
                <Box {...boxProps}>
                    <Header/>
                    <AppRoutes/>
                    {isPinOpen && <PinModal/>}
                    <CustomSnackbar/>
                </Box>
            </ColorSchemeProvider>
        </BrowserRouter>
    );
}

export default App;