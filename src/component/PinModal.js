import CustomModal, {CustomLogo, CustomTextLogo} from "./CommonModal";
import {useEffect, useLayoutEffect, useState} from "react";
import {Box, Flex, Image, Mask} from "gestalt";
import {useRecoilState} from "recoil";
import styled from "styled-components";
import {currentPinState, pinModalOpenState} from "../atom";
import api from "../api";

export default function PinModal() {

    const [isOpen, setIsOpen] = useRecoilState(pinModalOpenState);
    const [pinData, setPinData] = useRecoilState(currentPinState);
    const [direction, setDirection] = useState('row');
    const [w, setW] = useState("1200px");
    const [h, setH] = useState("700px");

    const handelModal = (bool) => {
        setIsOpen(bool);
    }

    const getPinData = async () => {
        try {
            const response = await api.get('/pin/' + pinData.id);
            setPinData(response.data);
        } catch (e) {
            console.error(e);
        }

    }

    useEffect(() => {
        console.log(pinData);
        console.log(typeof(pinData.width));
    }, [pinData])

    useLayoutEffect(() => {
        function updateDirection() {
            setDirection(window.innerWidth > 1300 ? 'row' : 'column');
            setW(window.innerWidth > 1300 ? "1200px" : window.innerWidth > 640 ? '65vw' : "450px");
            setH(window.innerHeight > 800 ? "700px" : '75vh');
        }

        updateDirection();

        window.addEventListener('resize', updateDirection);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => window.removeEventListener('resize', updateDirection);
    }, []);

    return (
        <CustomModal isOpen={isOpen} handleModal={handelModal} type={"lg"}>
            <Mask width={w} height={h} rounding={6}>
                <Container>
                    {direction === "row" ? (
                        <Mask rounding={6} width={"100%"} height={"100%"}>
                            <Flex width={"100%"} height={"100%"} direction={"row"}>
                                <Box width={"100%"} height={"100%"}>
                                    {pinData.width * 1 >= pinData.height * 1 ? (
                                        <PinImgW alt={pinData.id} src={pinData.imagePath}/>
                                    ) : (
                                        <PinImgH alt={pinData.id} src={pinData.imagePath}/>
                                    )}
                                </Box>
                                <Box width={"100%"} height={"100%"} minHeight={650}
                                     color={"lightWash"}>
                                    seed : {pinData.seed}
                                    <br/>
                                    memberid : {pinData.mid}
                                    <br/>
                                    width : {pinData.width}
                                    <br/>
                                    height : {pinData.height}
                                    <br/>
                                    tag : {pinData.tag}
                                </Box>
                            </Flex>
                        </Mask>) : (
                        <Mask rounding={6}>
                            <Flex width={"100%"} direction={"column"} overflow={"auto"}>
                                <Box width={"100%"} height={"75vh"} minHeight={550}
                                     color={"lightWash"}>

                                </Box>
                                <Box width={"100%"} height={"75vh"} minHeight={550}
                                     color={"infoBase"}>
                                </Box>
                            </Flex>
                        </Mask>
                    )}
                </Container>
            </Mask>
        </CustomModal>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    min-height: 650px;
    overflow: auto;
    z-index: 998;
    //display: flex;
    //justify-content: center;
    //align-items: center;

    /* 가로 스크롤바 너비를 0으로 설정하여 숨김 */

    &::-webkit-scrollbar {
        width: 0;
    }

    /* 옵션: 수직 스크롤바 숨기기 */

    &::-webkit-scrollbar-thumb {
        display: none;
    }
`;

const PinImgH = styled.img`
    border-radius: 1.2em;
    width: auto;
    height: 100%;
`;

const PinImgW = styled.img`
    border-radius: 1.2em;
    width: 100%;
    height: auto;
`;
