/**
 * usePinData.js
 * @description 핀 데이터를 관리하는 커스텀 훅
 */
import {useEffect, useState, useCallback} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {currentPinState, commentListState, isLoginState} from "../atom";
import api from "../api";
import {getCookieToken} from "../Cookies";
import useSnackbar from "./useSnackbar";

const usePinData = () => {
    const [pinData] = useRecoilState(currentPinState);
    const [commentList, setCommentList] = useRecoilState(commentListState);
    const [comment, setComment] = useState('');
    const [nickname, setNickname] = useState('');
    const [isLike, setIsLike] = useState(false);
    const isLogin = useRecoilValue(isLoginState);
    const {showSnackbar} = useSnackbar();

    /**
     * 핀의 댓글 데이터를 불러오는 함수
     * @type {(function(): Promise<void>)|*}
     */
    const getPinCommentData = useCallback(async () => {
        try {
            const response = await api.get(
                `/api/pins/comments/list?pinId=${pinData.pinId}`);
            setCommentList(response.data);
        } catch (e) {
            console.error(e);
            showSnackbar('error', '핀을 불러오는데 실패했습니다.');
        }
    }, [pinData.pinId, setCommentList, showSnackbar]);

    /**
     * 댓글을 등록하는 함수
     * @type {(function(): Promise<void>)|*}
     */
    const submitComment = useCallback(async () => {
        if (comment.trim() === '') {
            showSnackbar('warning', '댓글을 입력해주세요.');
            return;
        }

        if(!isLogin){
            showSnackbar('warning', '로그인이 필요합니다.');
            return;
        }

        try {
            await api.post('/api/pins/comments', {
                pinId: pinData.pinId,
                topLevelCommentId: null,
                level: 0,
                content: comment,
            });
            setComment('');
            showSnackbar('success', '댓글이 등록되었습니다.');
            getPinCommentData();
        } catch (e) {
            console.error(e);

            if (e.response.status === 401) {
                showSnackbar('warning', '로그인이 필요합니다.');
            } else {
                showSnackbar('error', '댓글을 등록하는데 실패했습니다.');
            }
        }
    }, [comment, pinData.pinId, showSnackbar, getPinCommentData]);

    /**
     * 닉네임을 불러오는 함수
     * @type {(function(): Promise<void>)|*}
     */
    const getNickname = useCallback(async () => {
        try {
            const response = await api.get('/api/member/profile');
            setNickname(response.data.nickname);
        } catch (e) {
            console.log(e);
        }
    }, []);

    /**
     * 좋아요 추가 함수
     */
    const handleLike = useCallback(async () => {

        if(!isLogin){
            showSnackbar('warning', '로그인이 필요합니다.');
            return;
        }

        if (isLike) {
            try {
                const response = await api.delete(
                    `/api/likes/pin/${pinData.pinId}`);
                response.status === 200 && setIsLike(false);
            } catch (e) {
                console.error(e);
                showSnackbar('error', '좋아요 해제에 실패했습니다.');
            }
        } else {
            try {
                const response = await api.post(`/api/likes/pin`, {
                    pinId: pinData.pinId
                });

                response.status === 200 && setIsLike(true);
            } catch (e) {
                console.error(e);
                showSnackbar('error', '좋아요 추가에 실패했습니다.');
            }
        }
       await broadcastLike();
    }, [pinData.pinId, isLike]);

    /**
     * 좋아요 중인지 체크하는 함수
     */
    const checkLike = async () => {
        try {
            const response = await api.get(
                `/api/likes/check/pin/${pinData.pinId}`);

            setIsLike(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 좋아요 개수를 불러오는 함수
     */
    const getCountLike = async () => {
        try {
            const response = await api.get(
                `/api/likes/pin/${pinData.pinId}`);
            console.log(response);
            return response.data;
        } catch (e) {
            console.error(e);
        }
    }

    const broadcastLike = async () => {
        try {
            await api.post(
                `/api/like-subscribe/broadcast`, {
                    pinId: pinData.pinId
                });

        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 로그인 상태일 때 닉네임을 불러옴
     */
    useEffect(() => {
        if (isLogin && getCookieToken()) {
            getNickname();
            checkLike();
        }
    }, [isLogin, getNickname]);

    useEffect(() => {
        if (pinData) {
            setCommentList([]);
            getPinCommentData();
        }
    }, [pinData, getPinCommentData, setCommentList]);

    return {
        pinData,
        commentList,
        comment,
        setComment,
        nickname,
        getPinCommentData,
        submitComment,
        handleLike,
        isLike,
        getCountLike,
    };
};

export default usePinData;
