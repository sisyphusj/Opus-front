import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import useSnackbar from "./useSnackbar";

const useMyComments = () => {
    const [commentData, setCommentData] = useState([]);
    const {showSnackbar} = useSnackbar();

    const getCommentData = useCallback(async () => {
        try {
            const response = await api.get('/api/pins/comments/my-comments');
            setCommentData(response.data);
        } catch (error) {
            console.error(error);
            showSnackbar('error', '댓글을 불러오는데 실패했습니다.');
        }
    }, [showSnackbar]);

    useEffect(() => {
        getCommentData();
    }, [getCommentData]);

    return {
        commentData,
        getCommentData
    };
};

export default useMyComments;
