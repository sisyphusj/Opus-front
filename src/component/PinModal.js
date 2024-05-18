import CustomModal, {CustomInput} from "./CommonModal";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Box, Flex, Mask} from "gestalt";
import {useRecoilState, useRecoilValue} from "recoil";
import styled from "styled-components";
import {currentPinState, pinModalOpenState, currentReplyState} from "../atom";
import api from "../api";
import Comments from "./Comment";


export default function PinModal() {

    const [isOpen, setIsOpen] = useRecoilState(pinModalOpenState);
    const [pinData, setPinData] = useRecoilState(currentPinState);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [inputLabel, setInputLabel] = useState('Comment');
    const [direction, setDirection] = useState('row');
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [reply, setReply] = useState('');
    const [currentCommentId, setCurrentCommentId] = useState(null);
    const [signal, setSignal] = useState(false);
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

    const getPinCommentData = async () => {
        try {
            const response = await api.get(`/comment/list/${pinData.pid}`);
            setCommentList(response.data);
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }

    }

    const getPinCommentDataRef = useRef(getPinCommentData);

    const submitComment = async () => {

        try {
            const response = await api.post('/comment/add', {
                pId: pinData.pid,
                parentCommentId: null,
                level: 0,
                content: comment,
            });
            console.log(response.data);
            setComment('');
            getPinCommentData();
        } catch (e) {
            console.error(e);
        }

    }

    // const Comments = ({comments}) => {
    //     const topLevelComments = comments.filter(comment => comment.parentCommentId === null);
    //     return (
    //         <div>
    //             {topLevelComments.map(comment => (
    //                 <Comment key={comment.cid} comment={comment} comments={comments}/>
    //             ))}
    //         </div>
    //     )
    //
    // }

    // function Comment({comment, comments}) {
    //     const replies = comments.filter(reply => reply.parentCommentId === comment.cid);
    //     return (
    //         <div style={{marginLeft: `${comment.level * 20}px`, marginTop: '15px'}}>
    //             <div style={{display: "flex"}}>
    //                 <Nick>{comment.nick}</Nick>
    //                 <CommentLine>{comment.content}
    //                     <div>{comment.createdDate} <IconButton onClick={() => handleReplyButton(comment)}>
    //                         <ChatIcon/>
    //                     </IconButton></div>
    //                     {isReplyOpen && comment.cid === currentCommentId &&
    //                         <Flex direction={"row"} alignItems={"center"}>
    //                         <CustomInput
    //                             id="reply_field"
    //                             label={inputLabel}
    //                             value={reply}
    //                             onChange={(e) => setReply(e.target.value)}
    //                             size="normal"
    //                             onKeyDown={(e) => handleOnKeyDown(e.key)}
    //                             InputProps={{
    //                                 sx: {
    //                                     borderRadius: '1.5rem',
    //                                     width: '380px',
    //                                 },
    //                             }}
    //                         />
    //                             <IconButton onClick={() => setIsReplyOpen(false)} size={"medium"} >
    //                                 <Close fontSize={"small"} />
    //                             </IconButton>
    //
    //                         </Flex>
    //                     }
    //                 </CommentLine>
    //             </div>
    //
    //
    //             {replies.map(reply => (
    //                 <Comment key={reply.cid} comment={reply} comments={comments}/>
    //             ))}
    //         </div>
    //     );
    // }

    // const handleReplyButton = (comment) => {
    //     setInputLabel(`Reply to ${comment.nick}`);
    //     setIsReplyOpen(true);
    //     setCurrentCommentId(comment.cid);
    // }

    useEffect(() => {
        getPinCommentData();
    }, []);

    useEffect(() => {
        console.log(pinData);
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
                                                <Comments comments={commentList} getPinCommentDataRef = {getPinCommentDataRef} />
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

const Nick = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const CommentLine = styled.div`
    margin-left: 8px;
    font-size: 15px;
    margin-top: 2px;
`;