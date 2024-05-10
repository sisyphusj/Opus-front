import {Box, ColorSchemeProvider} from 'gestalt';
import Feed from "./Feed";
import Header from "../component/Header";
import {useRecoilValue} from "recoil";
import {pinModalOpenState} from "../atom";
import PinModal from "../component/PinModal";

export default function Home() {

    const isPinOpen = useRecoilValue(pinModalOpenState);

    return (<>
            <Feed/>
            {isPinOpen && <PinModal/>}
        </>
    );
}