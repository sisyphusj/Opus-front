import CustomModal, {CustomInput} from "./CommonModal";
import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {Box, Flex, Mask} from "gestalt";
import {useRecoilState} from "recoil";
import styled from "styled-components";
import {currentPinState, pinModalOpenState, commentListState} from "../atom";
import api from "../api";
import Comments from "./Comment";


export default function PinModal() {

    const [isOpen, setIsOpen] = useRecoilState(pinModalOpenState);
    const [pinData, setPinData] = useRecoilState(currentPinState);
    const [commentList, setCommentList] = useRecoilState(commentListState);
    const [comment, setComment] = useState('');
    const [direction, setDirection] = useState('row');
    const [w, setW] = useState("1200px");
    const [h, setH] = useState("700px");
    // const {isModalOpen, setModalOpen} = useModal();
    // if(!isModalOpen) return null;

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

    useEffect(() => {
        getPinCommentData();
    }, []);

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

                                        <Box>
                                            <NickLabel>User {pinData.nick}</NickLabel>
                                        </Box>

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
                                                        width: '580px',
                                                    },
                                                }}
                                            />
                                    </Flex>
                                </Box>
                            </Flex>
                        </Mask>) : (
                        <Mask rounding={6}>
                            <Flex width={"100%"} direction={"column"} overflow={"auto"}>
                                <Box width={"100%"} height={700}>
                                    <PinImgH alt={pinData.id} src={pinData.imagePath}/>
                                </Box>
                                <Box paddingX={4} width={"100%"} height={"100%"} minHeight={650}>
                                    <Flex direction={"column"} justifyContent={"between"} height={"100%"}>

                                        <Box>
                                            <NickLabel>User {pinData.nick}</NickLabel>
                                        </Box>

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
                                                    width: '580px',
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
    margin-left: 10px;
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