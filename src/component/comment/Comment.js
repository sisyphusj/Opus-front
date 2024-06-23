import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Collapse, IconButton, Button} from "@mui/material";
import {ReactComponent as ChatIcon} from "../../assets/chat.svg";
import styled from "styled-components";
import {useComment} from "../../hooks/useComment";
import {formatDate} from "../../utils/dateUtils";
import ReplyInput from "./ReplyInput";
import MoreOptions from "./MoreOptions";
import {Favorite, FavoriteBorder} from "@mui/icons-material";

const Comment = React.memo(({comment, comments}) => {
    const {
        isLogin,
        isReplyOpen,
        isUpdateOpen,
        reply,
        currentCommentId,
        nickname,
        setReply,
        setIsReplyOpen,
        setCurrentCommentId,
        handleReplyButton,
        handleUpdateButton,
        submitReply,
        updateComment,
        deleteComment,
        handleLike,
        isLike,
        countLike
    } = useComment(comment);

    const replies = comments.filter(
        reply => reply.topLevelCommentId === comment.commentId);

    const [open, setOpen] = useState(false);

    const anchorRef = useRef(null);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const [currentDate, setCurrentDate] = useState('');

    const [showAllReplies, setShowAllReplies] = useState(false);

    /**
     * 더보기 버튼을 클릭했을 때의 동작
     */
    const handleToggle = useCallback(() => {
        setIsReplyOpen(false);
        setOpen((prevOpen) => !prevOpen);
    }, [setIsReplyOpen]);

    /**
     * 닫기 버튼을 클릭했을 때의 동작
     */
    const handleClose = useCallback((event) => {
        if (anchorRef.current?.contains(event.target)) {
            return;
        }
        setOpen(false);
    }, []);

    /**
     * 모든 대댓글 보기 버튼을 클릭했을 때의 동작
     */
    const handleShowAllReplies = () => {
        setShowAllReplies((prev) => !prev);
    };

    /**
     * 키보드 이벤트를 처리하는 함수
     */
    const handleOnKeyDown = (key) => {
        if (key === 'Enter') {
            if (isUpdateOpen) {
                updateComment();
            } else {
                submitReply();
            }
        }
    };

    /**
     * 대댓글 입력창을 닫는 함수
     */
    const handleCloseReply = () => {
        setIsReplyOpen(false);
        setCurrentCommentId(null);
    }

    /**
     * 대댓글 입력창을 가운데로 스크롤하는 함수
     */
    const scrollToMiddle = () => {
        if (containerRef.current && inputRef.current) {
            const containerHeight = containerRef.current.clientHeight;
            const inputPosition = inputRef.current.getBoundingClientRect().top
                - containerRef.current.getBoundingClientRect().top;
            containerRef.current.scrollTo({
                top: inputPosition - containerHeight / 2,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        setIsReplyOpen(false);
    }, [isLogin]);

    useEffect(() => {
        setCurrentDate(formatDate(comment.createdDate, comment.updatedDate));
    }, [comment.createdDate, comment.updatedDate]);

    useEffect(() => {
        if (isReplyOpen && comment.commentId === currentCommentId
            && inputRef.current) {
            scrollToMiddle();
            inputRef.current.focus();
        }
    }, [isReplyOpen, comment.commentId, currentCommentId]);

    return (
        <>
            <CommentContainer $level={comment.level}>
                <Nick style={{marginRight: "5px"}}>{comment.nickname}</Nick>
                <CommentLine>
                    <div style={{
                        width: "300px",
                        wordWrap: "break-word",
                        whiteSpace: "normal"
                    }}>

                        {comment.parentNickname ? <div
                                style={{color: "#F2709C"}}> @{comment.parentNickname} </div>
                            : null}
                        {comment.content}

                    </div>
                    <div style={{display: "flex"}}>
                        <div style={{marginTop: "10px"}}>
                            {currentDate}
                        </div>

                        <IconButton onClick={() => handleReplyButton(comment)}>
                            <ChatIcon/>
                        </IconButton>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <IconButton style={{height: "40px"}}
                                        onClick={() => handleLike()}>
                                {isLike ? <Favorite fontSize="small"
                                                    color="error"/> :
                                    <FavoriteBorder fontSize="small"
                                                    color="error"/>}
                            </IconButton>
                            {countLike}
                        </div>

                        {isLogin && nickname === comment.nickname && (
                            <MoreOptions
                                open={open}
                                anchorRef={anchorRef}
                                handleToggle={handleToggle}
                                handleClose={handleClose}
                                handleUpdateButton={() => handleUpdateButton(
                                    comment)}
                                deleteComment={deleteComment}
                            />
                        )}


                    </div>
                    {isReplyOpen && comment.commentId === currentCommentId &&
                        <ReplyInput
                            reply={reply}
                            setReply={setReply}
                            handleOnKeyDown={handleOnKeyDown}
                            handleCloseReply={handleCloseReply}
                            inputRef={inputRef}
                        />
                    }
                </CommentLine>
            </CommentContainer>

            {comment.level === 0 ? (
                <>
                    {replies.length > 0 && (
                        <Button size={"small"} variant={"text"}
                                onClick={handleShowAllReplies}
                                style={{marginLeft: "55px"}}>
                            {showAllReplies ? '숨기기'
                                : `모든 대댓글 보기 (${comments.filter(
                                    reply => reply.topLevelCommentId
                                        === comment.commentId).length})`}
                        </Button>
                    )}

                    <Collapse in={showAllReplies}>
                        {replies.map((reply) => (
                            <Comment key={reply.commentId} comment={reply}
                                     comments={comments}/>
                        ))}
                    </Collapse>
                </>
            ) : (
                <>
                    {replies.map((reply) => (
                        <Comment key={reply.commentId} comment={reply}
                                 comments={comments}/>
                    ))}
                </>
            )}
        </>
    );
});

export default Comment;

const CommentContainer = styled.div`
  display: flex;
  margin-left: ${props => `${props.$level * 20}px`};
  margin-top: 15px;
`;

const CommentLine = styled.div`
  margin-left: 8px;
  font-size: 15px;
  margin-top: 2px;
`;

const Nick = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
