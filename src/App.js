import {useRecoilValue} from "recoil";
import {isDarkModeState, pinModalOpenState} from "./atom";
import Setting from "./page/info/Setting";
import ImageGenerator from "./page/ImageGenerator";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./component/Header";
import {Box, ColorSchemeProvider} from "gestalt";
import MyProfile from "./page/info/MyProfile";
import MyLibrary from "./page/info/MyLibrary";
import PinModal from "./component/PinModal";
import MyComment from "./page/info/MyComment";
import CustomSnackbar from "./component/CustomSnackbar";
import Feed from "./page/Feed";

function App() {

    const mode = useRecoilValue(isDarkModeState);
    const isPinOpen = useRecoilValue(pinModalOpenState);

    return (
        <BrowserRouter>
            <ColorSchemeProvider colorScheme={mode ? "dark" : "light"} fullDimensions>
                <Box fit color="default" minWidth={575}>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<Feed />}/>
                        <Route path="/image-generator" element={<ImageGenerator/>}/>
                        <Route path="/settings" element={<Setting/>}>
                            <Route path="profile" element={<MyProfile/>}/>
                            <Route path="library" element={<MyLibrary/>}/>
                            <Route path="comment" element={<MyComment/>}/>
                        </Route>
                    </Routes>
                    {isPinOpen && <PinModal/>}
                    <CustomSnackbar />
                </Box>
            </ColorSchemeProvider>
        </BrowserRouter>
    );
}

export default App;
