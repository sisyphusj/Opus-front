import {useCallback, useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
    commentListState,
    currentPinState,
    currentReplyState,
    isLoginState,
    isReplyOpenState,
} from '../atom';
import api from '../api';
import {getCookieToken} from '../Cookies';
import useSnackbar from "./useSnackbar";

export const useComment = (comment) => {
    const isLogin = useRecoilValue(isLoginState);
    const [isReplyOpen, setIsReplyOpen] = useRecoilState(isReplyOpenState);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const [reply, setReply] = useState('');
    const [, setCommentList] = useRecoilState(commentListState);
    const pinData = useRecoilValue(currentPinState);
    const [currentCommentId, setCurrentCommentId] = useRecoilState(currentReplyState);
    const [nickname, setNickname] = useState('');

    const {showSnackbar} = useSnackbar();

    /**
     * 댓글 데이터를 불러오는 함수
     */
    const getCommentData = useCallback(async () => {
        try {
            const response = await api.get(`/api/pins/comments/list?pinId=${pinData.pinId}`);
            setCommentList(response.data);
        } catch (e) {
            showSnackbar('error', '댓글을 불러오는 중 오류가 발생했습니다.');
            console.error(e);
        }
    }, [pinData.pinId, setCommentList, showSnackbar]);

    /**
     * 다른 사용자에게 댓글을 남기기 위해 댓글창을 열거나 닫는 함수
     */
    const handleReplyButton = useCallback(() => {
        if (isReplyOpen && comment.commentId === currentCommentId) {
            setIsReplyOpen(false);
            setCurrentCommentId(null);
        } else {
            setIsReplyOpen(true);
            setCurrentCommentId(comment.commentId);
        }
    }, [isReplyOpen, comment.commentId, currentCommentId, setIsReplyOpen, setCurrentCommentId]);

    /**
     * 댓글 수정 버튼을 눌렀을 때 실행되는 함수
     */
    const handleUpdateButton = useCallback(() => {
        setIsUpdateOpen(true);
        handleReplyButton();
    }, [handleReplyButton]);

    /**
     * 덧글데이터를 서버로 전송하는 함수
     */
    const submitReply = useCallback(async () => {
        if (!isLogin) {
            showSnackbar("warning", "로그인이 필요합니다.");
            return;
        }

        if (reply.trim() === '') {
            showSnackbar('warning', '댓글을 입력해주세요.');
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

            showSnackbar('success', '댓글이 작성되었습니다.');

            setIsReplyOpen(false);
            setCurrentCommentId(null);

        } catch (e) {
            console.error(e);
            showSnackbar('error', '댓글을 작성하는 중 오류가 발생했습니다.');
        }
    }, [isLogin, reply, comment.pinId, comment.level, comment.commentId, comment.nickname, getCommentData, setIsReplyOpen, setCurrentCommentId, showSnackbar]);

    /**
     * 댓글을 수정하는 함수
     */
    const updateComment = useCallback(async () => {
        if (reply.trim() === '') {
            showSnackbar('warning', '댓글을 입력해주세요.');
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
            showSnackbar('success', '댓글이 수정되었습니다.');
            await getCommentData();
            setIsReplyOpen(false);
            setCurrentCommentId(null);

        } catch (e) {
            console.log(e);
            showSnackbar('error', '댓글을 수정하는 중 오류가 발생했습니다.');
        }
    }, [reply, comment.commentId, comment.pinId, comment.level, getCommentData, setIsReplyOpen, setCurrentCommentId, showSnackbar]);

    /**
     * 댓글을 삭제하는 함수
     */
    const deleteComment = useCallback(async () => {
        try {
            await api.delete(`/api/pins/comments/${comment.commentId}`);

            showSnackbar('success', '댓글이 삭제되었습니다.');
            await getCommentData();
            setCurrentCommentId(null);
        } catch (e) {
            console.log(e);
            showSnackbar('error', '댓글을 삭제하는 중 오류가 발생했습니다.');
        }
    }, [comment.commentId, getCommentData, setCurrentCommentId, showSnackbar]);

    /**
     * 사용자의 닉네임을 불러오는 함수
     */
    const getNickname = async () => {
        try {
            const response = await api.get('/api/member/profile');
            setNickname(response.data.nickname);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (isLogin && getCookieToken()) {
            getNickname();
        }
    }, [isLogin]);

    return {
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
    };
};
