/**
 * PinDetails.js
 * @description PinModal 의 공통 부분 중 상세 정보를 보여주는 컴포넌트
 */
import React, {useEffect} from 'react';
import {Box, Flex, Heading} from "gestalt";
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary
} from "@mui/joy";
import Comments from "../../comment/Comments";
import DeleteButton from "../../buttons/PinDeleteButton";
import ChangeButton from "../../buttons/PinChangeButton";
import NickLabel from "../../labels/PinNickLabel";
import PinImage from "./PinImage";
import {Background, CustomInput} from "../CommonModal";
import styled from "styled-components";
import {IconButton} from "@mui/material";
import {Favorite, FavoriteBorder} from "@mui/icons-material";
import useSSE from "../../../hooks/useSSE";
import {QueryClient} from "react-query";
import {useRecoilValue} from "recoil";
import {isLoginState} from "../../../atom";
import LikeCounter from "./LikeCounter";
import api from "../../../api";

const PinDetails = React.memo(({
    direction,
    pinData,
    isMyPin,
    isDelete,
    setIsDelete,
    commentList,
    comment,
    setComment,
    handleOnKeyDown,
    handleLike,
    isLike,
    handleDeleteConfirm,
}) => {
    const {likeCount} = useSSE(QueryClient);
    const [defaultLikeCount, setDefaultLikeCount] = React.useState(0);
    const isLogin = useRecoilValue(isLoginState);

    const getCountLike = async () => {
        try {
            const response = await api.get(
                `/api/likes/pin/${pinData.pinId}`);
            setDefaultLikeCount(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if(!isLogin){
           getCountLike();
        }
    }, []);


    return (
        <Flex width={"100%"} height={"100%"} direction={direction}>
            <Box width={"100%"} height={"100%"}>
                <PinImage
                    src={pinData.imagePath}
                    alt={pinData.username}
                    isWide={pinData.width * 1 >= pinData.height * 1}
                />
            </Box>
            <Box paddingX={4} width={"100%"} height={"100%"} minHeight={650}>
                <Flex direction={"column"} justifyContent={"between"}
                      height={"100%"}>
                    <Flex>
                        <NickLabel>User {pinData.nickname}</NickLabel>
                        <IconButton style={{marginBottom : "10px"}} onClick={() => handleLike()}>
                            {isLike ? <Favorite fontSize="medium" color="error"/> : <FavoriteBorder fontSize="medium" color="error"/> }
                        </IconButton>
                        {isLogin ? <LikeCounter likeCount={likeCount}/> : <LikeCounter likeCount={defaultLikeCount}/>}
                        {isMyPin && (
                            <DeleteButton onClick={() => setIsDelete(
                                true)}> delete </DeleteButton>
                        )}
                    </Flex>

                    {isDelete && (
                        <Background>
                            <CheckSaveBox>
                                <Heading color={"dark"} size={"400"}>
                                    정말로 삭제하시겠습니까?
                                </Heading>
                                <Flex>
                                    <Box marginTop={6}>
                                        <ChangeButton
                                            onClick={handleDeleteConfirm}> 네</ChangeButton>
                                        <ChangeButton
                                            onClick={() => setIsDelete(false)}
                                            style={{marginLeft: "20px"}}
                                        >
                                            아니요
                                        </ChangeButton>
                                    </Box>
                                </Flex>
                            </CheckSaveBox>
                        </Background>
                    )}

                    <Box marginStart={3} marginBottom={5}>
                        <Label>Seed</Label>
                        {pinData.seed}
                    </Box>

                    <AccordionGroup disableDivider>
                        <Accordion sx={{marginBottom: "10px"}}>
                            <AccordionSummary>
                                <Label>Prompt</Label>
                            </AccordionSummary>
                            <AccordionDetails>{pinData.prompt}</AccordionDetails>
                        </Accordion>

                        <Accordion sx={{marginBottom: "20px"}}>
                            <AccordionSummary>
                                <Label>Negative Prompt</Label>
                            </AccordionSummary>
                            <AccordionDetails> {pinData.negativePrompt} </AccordionDetails>
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
                                borderRadius: "1.5rem",
                                width: "100%",
                            },
                        }}
                    />
                </Flex>
            </Box>
        </Flex>
    );
});

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
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }
`;

export default PinDetails;
