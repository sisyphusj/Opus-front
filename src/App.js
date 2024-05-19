import {useRecoilValue} from "recoil";
import {isDarkMode, pinModalOpenState} from "./atom";
import Home from "./page/Home";
import Setting from "./page/info/Setting";
import ImageGenerator from "./page/ImageGenerator";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./component/Header";
import {Box, ColorSchemeProvider} from "gestalt";
import MyProfile from "./page/info/MyProfile";
import MyLibrary from "./page/info/MyLibrary";
import PinModal from "./component/PinModal";

function App() {

    const mode = useRecoilValue(isDarkMode);
    const isPinOpen = useRecoilValue(pinModalOpenState);

    return (
        <BrowserRouter>
            <ColorSchemeProvider colorScheme={mode ? "dark" : "light"} fullDimensions>
                <Box fit color="default" minWidth={575}>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/image-generator" element={<ImageGenerator/>}/>
                        <Route path="/settings" element={<Setting/>}>
                            <Route path="profile" element={<MyProfile/>}/>
                            <Route path="library" element={<MyLibrary/>}/>
                        </Route>
                    </Routes>
                    {isPinOpen && <PinModal/>}
                </Box>
            </ColorSchemeProvider>
        </BrowserRouter>
    );
}

export default App;
