import {useRecoilValue} from "recoil";
import {isDarkMode} from "./atom";
import Home from "./page/Home";
import Setting from "./page/info/Setting";
import ImageGenerator from "./page/ImageGenerator";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./component/Header";
import {Box, ColorSchemeProvider} from "gestalt";
import MyProfile from "./page/info/MyProfile";
import MyLibrary from "./page/info/MyLibrary";

function App() {

    const mode = useRecoilValue(isDarkMode);

    return (
        <BrowserRouter>
            <ColorSchemeProvider colorScheme={mode ? "dark" : "light"} fullDimensions>
                <Box fit color="default" overflow={"hidden"} minWidth={575}>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/image-generator" element={<ImageGenerator/>}/>
                        <Route path="/settings" element={<Setting />}>
                            <Route path="profile" element={<MyProfile />}/>
                            <Route path="library" element={<MyLibrary />}/>
                        </Route>
                    </Routes>
                </Box>
            </ColorSchemeProvider>
        </BrowserRouter>
    );
}

export default App;
