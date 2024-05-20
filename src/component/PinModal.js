import CustomModal, {Background, CustomButton, CustomInput} from "./CommonModal";
import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {Box, Flex, Heading, Mask} from "gestalt";
import {useRecoilState, useRecoilValue} from "recoil";
import styled from "styled-components";
import {currentPinState, pinModalOpenState, commentListState, isLoginState} from "../atom";
import api from "../api";
import Comments from "./Comment";
import {Accordion, AccordionDetails, AccordionGroup, AccordionSummary} from "@mui/joy";


export default function PinModal() {

    const [isOpen, setIsOpen] = useRecoilState(pinModalOpenState);
    const [pinData, setPinData] = useRecoilState(currentPinState);
    const [commentList, setCommentList] = useRecoilState(commentListState);
    const [comment, setComment] = useState('');
    const [direction, setDirection] = useState('row');
    const [nickname, setNickname] = useState('');
    const [isDelete, setIsDelete] = useState(false);
    const [isMyPin, setIsMyPin] = useState(false);
    const isLogin = useRecoilValue(isLoginState);

    const [w, setW] = useState("1200px");
    const [h, setH] = useState("700px");

    const handelModal = (bool) => {
        setIsOpen(bool);
    }

    const handleOnKeyDown = (e) => {
        if (e === 'Enter') {
            submitComment();
        }
    }

    const getPinCommentData = useCallback(async () => {
        try {
            const response = await api.get(`/comment/list/${pinData.pid}`);
            setCommentList(response.data);
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }

    }, [pinData]);

    const submitComment = async () => {

        try {
            const response = await api.post('/comment/add', {
                pId: pinData.pid,
                parentCommentId: null,
                level: 0,
                content: comment,
            });
            setComment('');
            getPinCommentData();
        } catch (e) {
            console.error(e);
        }

    }

    const getNick = () => {
        try {
            const response = api.get('/member/profile');

            response.then((res) => {
                setNickname(res.data.nick);
                console.log("나의 닉네임은 ", res.data.nick);
            });
        } catch (e) {
            console.log(e);
        }
    }

    const deletePin = async () => {
        try {
            const response = await api.delete(`/pin/${pinData.pid}`);
            console.log(response);
            setIsOpen(false);
            window.location.reload();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getPinCommentData();
            if(isLogin) {
                getNick();
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (pinData.nick === nickname) {
            setIsMyPin(true);
        } else {
            setIsMyPin(false);
        }
    }, [pinData, nickname]);

    useLayoutEffect(() => {
        function updateDirection() {
            setDirection(window.innerWidth > 1300 ? 'row' : 'column');
            setW(window.innerWidth > 1300 ? "1200px" : window.innerWidth > 640 ? '65vw' : "450px");
            setH(window.innerHeight > 800 ? "700px" : '75vh');
        }

        updateDirection();

        window.addEventListener('resize', updateDirection);
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
                                <Box paddingX={4} width={"100%"} height={"100%"} minHeight={650}>
                                    <Flex direction={"column"} justifyContent={"between"} height={"100%"}>

                                        <Flex>
                                            <NickLabel>User {pinData.nick}</NickLabel> {isMyPin && (
                                            <DeleteButton onClick={() => setIsDelete(true)}> delete </DeleteButton>
                                        )}
                                        </Flex>

                                        {isDelete && <Background>
                                            <CheckSaveBox>
                                                <Heading color={"dark"} size={"400"}>정말로 삭제하시겠습니까?</Heading>
                                                <Flex>
                                                    <Box marginTop={6}>
                                                        <ChangeButton onClick={() => deletePin()}> 네</ChangeButton>
                                                        <ChangeButton onClick={() => setIsDelete(false)} style={{
                                                            marginLeft: "20px"
                                                        }}> 아니요</ChangeButton>
                                                    </Box>
                                                </Flex>
                                            </CheckSaveBox>
                                        </Background>}

                                        <Box marginStart={3} marginBottom={5}>
                                            <Label>Seed</Label>
                                            {pinData.seed}
                                        </Box>

                                        <AccordionGroup disableDivider>
                                            <Accordion sx={{marginBottom: "10px"}}>
                                                <AccordionSummary> <Label>Prompt</Label></AccordionSummary>
                                                <AccordionDetails>{pinData.tag}</AccordionDetails>
                                            </Accordion>

                                            <Accordion sx={{marginBottom: "20px"}}>
                                                <AccordionSummary> <Label>Negative Prompt</Label> </AccordionSummary>
                                                <AccordionDetails> {pinData.ntag} </AccordionDetails>
                                            </Accordion>
                                        </AccordionGroup>


                                        <Label style={{marginLeft: "14px"}}>Comment</Label>
                                        <CommentContainer>
                                            <Box marginTop={3}>
                                                <Comments comments={commentList}/>
                                            </Box>
                                        </CommentContainer>
                                        <CustomInput
                                            id="comment_field"
                                            label="Comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            size="normal"
                                            margin="dense"
                                            onKeyDown={(e) => handleOnKeyDown(e.key)}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '1.5rem',
                                                    width: '100%',
                                                },
                                            }}
                                        />
                                    </Flex>
                                </Box>
                            </Flex>
                        </Mask>) : (
                        <Mask rounding={6}>
                            <Flex width={"100%"} direction={"column"} overflow={"auto"}>
                                <Box width={"100%"} height={700} marginBottom={5}>
                                    {pinData.width * 1 >= pinData.height * 1 ? (
                                        <PinImgW alt={pinData.id} src={pinData.imagePath}/>
                                    ) : (
                                        <PinImgH alt={pinData.id} src={pinData.imagePath}/>
                                    )}
                                </Box>
                                <Box paddingX={4} width={"100%"} height={"100%"} minHeight={650}>
                                    <Flex direction={"column"} justifyContent={"between"} height={"100%"}>

                                        <Flex>
                                            <NickLabel>User {pinData.nick}</NickLabel> {isMyPin && (
                                            <DeleteButton onClick={() => setIsDelete(true)}> delete </DeleteButton>
                                        )}
                                        </Flex>

                                        {isDelete && <Background>
                                            <CheckSaveBox>
                                                <Heading color={"dark"} size={"400"}>정말로 삭제하시겠습니까?</Heading>
                                                <Flex>
                                                    <Box marginTop={6}>
                                                        <ChangeButton onClick={() => deletePin()}> 네</ChangeButton>
                                                        <ChangeButton onClick={() => setIsDelete(false)} style={{
                                                            marginLeft: "20px"
                                                        }}> 아니요</ChangeButton>
                                                    </Box>
                                                </Flex>
                                            </CheckSaveBox>
                                        </Background>}

                                        <Box marginStart={3} marginBottom={5}>
                                            <Label>Seed</Label>
                                            {pinData.seed}
                                        </Box>

                                        <Box marginStart={3} marginBottom={5}>
                                            <Label>Prompt</Label>
                                            {pinData.tag}
                                        </Box>

                                        <Box marginStart={3} marginBottom={5}>
                                            <Label>Negative Prompt</Label>
                                            {pinData.ntag}
                                        </Box>

                                        <Label style={{marginLeft: "10px"}}>Comment</Label>
                                        <CommentContainer>
                                            <Box marginTop={3} height={400}>
                                                <Comments comments={commentList}/>
                                            </Box>
                                        </CommentContainer>
                                        <CustomInput
                                            id="comment_field"
                                            label="Comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            size="normal"
                                            margin="dense"
                                            onKeyDown={(e) => handleOnKeyDown(e.key)}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '1.5rem',
                                                    width: '100%',
                                                },
                                            }}
                                        />
                                    </Flex>
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

    &::-webkit-scrollbar {
        width: 0;
    }

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

const NickLabel = styled.h1`
    margin-left: 6px;
    margin-bottom: 10px;
    color: #F2709C;
`;

const Label = styled.h3`
    margin-bottom: 5px;
`;

const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 14px;
    width: 100%;
    height: 100%;
    //max-height: 250px;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 0;
    }

    &::-webkit-scrollbar-thumb {
        display: none;
    }
`;

const DeleteButton = styled.button`
    width: 100px;
    height: 30px;
    margin-left: 40px;
    margin-top: 4px;
    background-color: transparent;
    border-radius: 1.5rem;
    color: #ff9472;
    font-size: 15px;
    font-weight: bold;
    border: 1px solid #ff9472;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background: #ff9472;
        color: white;
    }
`;

const ChangeButton = styled(CustomButton)`
    width: 90px;
    height: 49px;
    border-radius: 1rem;
    font-size: 16px;
`;

const CheckSaveBox = styled.div`
    width: 450px;
    height: 200px;
    border-radius: 1rem;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;