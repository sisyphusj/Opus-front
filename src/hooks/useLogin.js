import {useCallback, useState} from 'react';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {isLoginState} from '../atom';
import {setRefreshToken, removeCookieToken} from '../Cookies';
import api from '../api';
import {useNavigate} from 'react-router-dom';
import useSnackbar from "./useSnackbar";

const useLogin = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useRecoilState(isLoginState);
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();

    const login = useCallback(async (handleModal) => {

        // 아이디 또는 비밀번호가 입력되지 않았을 경우
        if (id.trim() === '' || password.trim() === '') {
            showSnackbar('warning', '아이디 또는 비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('https://api.sisyphusj.me/api/auth/login', {
                username: id,
                password: password,
            });

            if (response.status === 200) {
                setRefreshToken(response.data.refreshToken);
                sessionStorage.setItem('accessToken', response.data.accessToken);
                setIsLogin(true);
                showSnackbar('success', '로그인하였습니다.');
                handleModal(false);
            }

        } catch (e) {
            if (e.response?.data?.code === "A003") {
                showSnackbar('error', '아이디 또는 비밀번호가 맞지 않습니다.');
            } else {
                showSnackbar('error', '로그인 중 오류가 발생했습니다.');
            }
        }
    }, [id, password, showSnackbar, setIsLogin]);

    const logout = useCallback(async () => {
        try {
            await api.post('/api/auth/logout');

            removeCookieToken();
            sessionStorage.removeItem('accessToken');
            setIsLogin(false);
            navigate('/');
            showSnackbar('info', '로그아웃하였습니다.');
        } catch (e) {
            console.error(e);
            showSnackbar('error', '로그아웃 중 오류가 발생했습니다.');
        }
    }, [showSnackbar, navigate, setIsLogin]);

    return {
        id,
        setId,
        password,
        setPassword,
        isLogin,
        login,
        logout,
    };
}

export default useLogin;
