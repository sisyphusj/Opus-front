import React, {useEffect, useRef, useState} from 'react';
import {CustomInput} from "./CommonModal";
import {Flex} from "gestalt";
import {Collapse, IconButton, MenuItem, Button} from "@mui/material";
import {ReactComponent as ChatIcon} from "../assets/chat.svg";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styled from "styled-components";
import {Close} from "@mui/icons-material";
import api from "../api";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    commentListState,
    currentPinState,
    currentReplyState,
    isLoginState,
    isReplyOpenState, snackMessageState,
    snackOpenState, snackTypeState
} from "../atom";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import {getCookieToken} from "../Cookies";

const Comments = ({comments}) => {
    const topLevelComments = comments.filter(comment => comment.topLevelCommentId === null);
    const bottomRef = useRef(null);
    const isInitialMount = useRef(0);

    useEffect(() => {
        if (isInitialMount.current < 2) {
            isInitialMount.current++;
        } else {
            if (bottomRef.current) {
                bottomRef.current.scrollIntoView({behavior: "smooth"});
            }
        }
    }, [comments]);

    return (
        <div>
            {topLevelComments.map(comment => (
                <Comment key={comment.commentId} comment={comment} comments={comments}/>
            ))}
            <div ref={bottomRef}/>
        </div>
    );
};

const Comment = React.memo(({comment, comments}) => {
    const isLogin = useRecoilValue(isLoginState);
    const [isReplyOpen, setIsReplyOpen] = useRecoilState(isReplyOpenState);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [reply, setReply] = useState('');
    const [currentCommentId, setCurrentCommentId] = useRecoilState(currentReplyState);
    const replies = comments.filter(reply => reply.topLevelCommentId === comment.commentId);
    const pinData = useRecoilValue(currentPinState);
    const [commentList, setCommentList] = useRecoilState(commentListState);
    const [nickname, setNickname] = useState('');
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const containerRef = useRef(null);
    const [currentDate, setCurrentDate] = useState('');
    const inputRef = useRef(null);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useRecoilState(snackOpenState);
    const [snackbarMessage, setSnackbarMessage] = useRecoilState(snackMessageState);
    const [snackbarType, setSnackbarType] = useRecoilState(snackTypeState);

    const handleSnackBar = (type, msg) => {
        setSnackbarType(type);
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
    }

    const getCommentData = async () => {
        try {
            const response = await api.get(`/api/pins/comments/list?pinId=${pinData.pinId}`);
            setCommentList(response.data);
        } catch (e) {
            handleSnackBar('error', '댓글을 불러오는 중 오류가 발생했습니다.');
            console.error(e);
        }
    };

    const handleReplyButton = (comment) => {
        if (isReplyOpen && comment.commentId === currentCommentId) {
            setIsReplyOpen(false);
            setCurrentCommentId(null);
        } else {
            setIsReplyOpen(false);
            setOpen(false);
            setCurrentCommentId(comment.commentId);
            setIsReplyOpen(true);
        }
    };

    const handleUpdateButton = (comment) => {
        setIsUpdateOpen(true);
        handleReplyButton(comment);
    };

    const handleShowAllReplies = () => {
        setShowAllReplies((prev) => !prev);
    };

    const handleOnKeyDown = (key) => {
        if (key === 'Enter') {
            if (isUpdateOpen)
                updateComment();
            else
                submitReply();
        }
    };

    const handleCloseReply = () => {
        setIsReplyOpen(false);
        setCurrentCommentId(null);
    }

    const submitReply = async () => {

        if (!isLogin) {
            handleSnackBar( "warning","로그인이 필요합니다.");
            return;
        }

        if(reply.trim() === '') {
            handleSnackBar('warning', '댓글을 입력해주세요.');
            return;
        }

        try {
            await api.post('/api/pins/comments', {
                pinId: comment.pinId,
                topLevelCommentId: comment.level === 0 ? comment.commentId : comment.topLevelCommentId,
                content: reply,
                level: 1,
                parentNick: comment.nickname,
            });

            setReply('');
            await getCommentData();

            handleSnackBar('success', '댓글이 작성되었습니다.');

            setIsReplyOpen(false);
            setCurrentCommentId(null);

        } catch (e) {
            console.error(e);
            handleSnackBar('error', '댓글을 작성하는 중 오류가 발생했습니다.');
        }
    }

    const updateComment = async () => {

        if(reply.trim() === '') {
            handleSnackBar('warning', '댓글을 입력해주세요.');
            return;
        }

        try {
            await api.put('/api/pins/comments', {
                cId: comment.commentId,
                pId: comment.pinId,
                level: comment.level,
                content: reply,
            });

            setReply('');
            handleSnackBar('success', '댓글이 수정되었습니다.');
            await getCommentData();
            setIsReplyOpen(false);
            setCurrentCommentId(null);

        } catch (e) {
            console.log(e);
            handleSnackBar('error', '댓글을 수정하는 중 오류가 발생했습니다.');
        }
        setOpen(false);
    }

    const deleteComment = async () => {

        console.log(comment.commentId);

        try {
            await api.delete(`/api/pins/comments/${comment.commentId}`);

            handleSnackBar('success', '댓글이 삭제되었습니다.');
            await getCommentData();
            setCurrentCommentId(null);
        } catch (e) {
            console.log(e);
            handleSnackBar('error', '댓글을 삭제하는 중 오류가 발생했습니다.');
        }
        setOpen(false);
    }

    const getNickname = () => {
        try {
            const response = api.get('/api/member/profile');

            response.then((res) => {
                setNickname(res.data.nickname);
            });
        } catch (e) {
            console.log(e);
        }
    }

    const handleToggle = () => {
        setIsReplyOpen(false);
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    const scrollToMiddle = () => {
        if (containerRef.current && inputRef.current) {
            const containerHeight = containerRef.current.clientHeight;
            const inputPosition = inputRef.current.getBoundingClientRect().top - containerRef.current.getBoundingClientRect().top;
            containerRef.current.scrollTo({
                top: inputPosition - containerHeight / 2,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        setIsReplyOpen(false);

        if (isLogin && getCookieToken()) {
            getNickname();
        }
    }, [isLogin]);

    useEffect(() => {

        const createDate = new Date(comment.createdDate);
        const updateDate = new Date(comment.updatedDate);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        if (updateDate >= createDate) {
            setCurrentDate(formatDate(updateDate));
        } else {
            setCurrentDate(formatDate(createDate));
        }
    }, []);

    useEffect(() => {
        if (isReplyOpen && comment.commentId === currentCommentId && inputRef.current) {
            scrollToMiddle();
            inputRef.current.focus();
        }
    }, [isReplyOpen, comment.commentId, currentCommentId]);

    return (
        <div>
            <div style={{display: "flex", marginLeft: `${comment.level * 20}px`, marginTop: '15px'}}>
                <Nick style={{marginRight: "5px"}}>{comment.nickname}</Nick>
                <CommentLine>
                    <div style={{
                        width: "300px",
                        wordWrap: "break-word",
                        whiteSpace: "normal"
                    }}>{comment.parentNickname && <>@{comment.parentNickname}</>} {comment.content}</div>
                    <div style={{display: "flex"}}>
                        <div style={{marginTop: "10px"}}>
                            {currentDate}
                        </div>

                        <IconButton onClick={() => handleReplyButton(comment)}>
                            <ChatIcon/>
                        </IconButton>

                        <div ref={containerRef} style={{position: 'relative'}}>

                            {isLogin && nickname === comment.nickname && <IconButton onClick={handleToggle} ref={anchorRef}>
                                <MoreHorizIcon/>
                            </IconButton>}

                            <Popper
                                open={open}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                placement="bottom-start"
                                transition
                                disablePortal
                                container={containerRef.current}
                                style={{zIndex: 3}}
                            >
                                {({TransitionProps, placement}) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin:
                                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList
                                                    autoFocusItem={open}
                                                    id="composition-menu"
                                                    aria-labelledby="composition-button"
                                                    onKeyDown={handleListKeyDown}
                                                >
                                                    <MenuItem onClick={() => handleUpdateButton(comment)}>수정</MenuItem>
                                                    <MenuItem onClick={() => deleteComment()}>삭제</MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                    </div>
                    {isReplyOpen && comment.commentId === currentCommentId &&
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
                                inputRef={inputRef}
                            />
                            <IconButton onClick={() => handleCloseReply()} size={"medium"}>
                                <Close fontSize={"small"}/>
                            </IconButton>
                        </Flex>
                    }
                </CommentLine>
            </div>

            {comment.level === 0 ? (
                <>
                    {replies.length > 0 && (
                        <Button size = {"small"} variant={"text"} onClick={handleShowAllReplies} style={{marginLeft : "55px"}} >
                            {showAllReplies ? '숨기기' : `모든 대댓글 보기 (${comments.filter(reply => reply.topLevelCommentId === comment.commentId).length})`}
                        </Button>
                    )}

                    <Collapse in={showAllReplies}>
                        {replies.map((reply) => (
                            <Comment key={reply.commentId} comment={reply} comments={comments}/>
                        ))}
                    </Collapse>
                </>
            ) : (
                <>
                    {replies.map((reply) => (
                        <Comment key={reply.commentId} comment={reply} comments={comments}/>
                    ))}
                </>
            )}

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
