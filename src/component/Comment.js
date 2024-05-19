import React, {useCallback, useEffect, useRef, useState} from 'react';
import {CustomInput} from "./CommonModal";
import {Flex} from "gestalt";
import {IconButton} from "@mui/material";
import {ReactComponent as ChatIcon} from "../assets/chat.svg";
import styled from "styled-components";
import {Close} from "@mui/icons-material";
import api from "../api";
import {useRecoilState, useRecoilValue} from "recoil";
import {commentListState, currentPinState, currentReplyState, isReplyOpenState} from "../atom";

const Comments = ({ comments }) => {
    const topLevelComments = comments.filter(comment => comment.parentCommentId === null);
    const bottomRef = useRef(null);
    const isInitialMount = useRef(0);

    useEffect(() => {
        console.log("comments changed");
        if (isInitialMount.current < 2) {
            isInitialMount.current ++;
        } else {
            if (bottomRef.current) {
                bottomRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [comments]);

    return (
        <div>
            {topLevelComments.map(comment => (
                <Comment key={comment.cid} comment={comment} comments={comments}/>
            ))}
            <div ref={bottomRef}/>
        </div>
    );
};

const Comment = React.memo(({ comment, comments }) => {
    const [isReplyOpen, setIsReplyOpen] = useRecoilState(isReplyOpenState);
    const [reply, setReply] = useState('');
    const [currentCommentId, setCurrentCommentId] = useRecoilState(currentReplyState);
    const replies = comments.filter(reply => reply.parentCommentId === comment.cid);
    const pinData = useRecoilValue(currentPinState);
    const [commentList, setCommentList] = useRecoilState(commentListState);

    const getCommentData = async () => {

        try {
            const response = await api.get(`/comment/list/${pinData.pid}`);
            console.log(response.data);
            setCommentList(response.data);
        } catch (e) {
            console.error(e);
        }
    };


    const handleReplyButton = (comment) => {
        setIsReplyOpen(false);
        setCurrentCommentId(comment.cid);
        setIsReplyOpen(true);
    };

    const handleOnKeyDown = (key) => {
        if (key === 'Enter') {
            console.log(reply);
            submitReply();
        }
    };

    const handleCloseReply = () => {
        setIsReplyOpen(false);
        setCurrentCommentId(null);
    }

    const submitReply = async () => {

        try{
            const response = await api.post('/comment/add', {
                pId : comment.pid,
                parentCommentId : comment.cid,
                content : reply,
                level : comment.level + 1,
            });

            console.log(response);
            setReply('');
            await getCommentData();
            setIsReplyOpen(false);
            setCurrentCommentId(null);

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div style={{ marginLeft: `${comment.level * 20}px`, marginTop: '15px' }}>
            <div style={{ display: "flex" }}>
                <Nick>{comment.nick}</Nick>
                <CommentLine>{comment.content}
                    <div>{comment.createdDate} <IconButton onClick={() => handleReplyButton(comment)}>
                        <ChatIcon />
                    </IconButton></div>
                    {isReplyOpen && comment.cid === currentCommentId &&
                        <Flex direction={"row"} alignItems={"center"}>
                            <CustomInput
                                id="reply_field"
                                label="Reply"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                size="normal"
                                onKeyDown={(e) => handleOnKeyDown(e.key)}
                                InputProps={{
                                    sx: {
                                        borderRadius: '1.5rem',
                                        width: '380px',
                                    },
                                }}
                            />
                            <IconButton onClick={() => handleCloseReply()} size={"medium"} >
                                <Close fontSize={"small"} />
                            </IconButton>
                        </Flex>
                    }
                </CommentLine>
            </div>

            {replies.map(reply => (
                <Comment key={reply.cid} comment={reply} comments={comments} />
            ))}
        </div>
    );
});

export default Comments;

const CommentLine = styled.div`
    margin-left: 8px;
    font-size: 15px;
    margin-top: 2px;
`;

const Nick = styled.div`
    font-size: 20px;
    font-weight: bold;
`;
