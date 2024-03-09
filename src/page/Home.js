import {Box, ColorSchemeProvider} from 'gestalt';
import Feed from "../component/Feed";
import Header from "../component/Header";

export default function Home() {
    return (
        // <ColorSchemeProvider colorScheme="light" fullDimensions>
        //     <Box fit={true} color="default" overflow={"hidden"}>
                <Feed />
    );
}