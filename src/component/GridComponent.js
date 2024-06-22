import {Box,  Flex, Image, Mask} from "gestalt";
import {useState} from "react";
import styled from "styled-components";
import {useRecoilState} from "recoil";
import {currentPinState, pinModalOpenState} from "../atom";

export default function GridComponent({data}) {
    const [hover, setHover] = useState(false);
    const [, setClicked] = useRecoilState(pinModalOpenState);
    const [, setCurrentPin] = useRecoilState(currentPinState);

    const  handleHover = (bool) => {
        setHover(bool);
    }

    const handleClicked = (bool) => {
        setCurrentPin(data);
        setClicked(bool);
    }

    return (
        <Flex direction="column">
            <Mask rounding={4}>
                <Box tyle={{filter: "none"}} height="100%" onMouseOver={() => handleHover(true)}
                     onMouseOut={() => handleHover(false)}>
                     <Main $hover = {hover} onClick={() => handleClicked(true)}>
                        <Image
                            naturalHeight={data.height ? data.height : 1024}
                            naturalWidth={data.width ? data.width : 1024}
                            src={data.imagePath}
                        >
                            <Box height="100%"  onMouseOver={() => handleHover(true)}
                                 onMouseOut={() => handleHover(false)}>
                            </Box>
                        </Image>
                    </Main>
                </Box>
            </Mask>
        </Flex>
    );
}

const Main = styled.div`
    width: 100%;
    height: 100%;
    z-index: 1;
    filter: ${({ $hover }) => ($hover ? "brightness(0.7) saturate(0.9)" : "none")};
`;
