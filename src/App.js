import {useRecoilValue} from "recoil";
import {isDarkMode} from "./atom";
import Home from "./page/Home";
import ImageGenerator from "./page/ImageGenerator";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./component/Header";
import {Box, ColorSchemeProvider} from "gestalt";

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
                    </Routes>
                </Box>
            </ColorSchemeProvider>
        </BrowserRouter>
    );
}

export default App;
