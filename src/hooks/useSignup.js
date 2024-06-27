// src/hooks/useSignup.js
import { useState, useCallback } from 'react';
import axios from 'axios';
import api from '../api';
import { useRecoilState } from 'recoil';
import {
    signUpOpenState,
    snackMessageState,
    snackOpenState,
    snackTypeState
} from '../atom';

const useSignup = () => {
    const [id, setId] = useState('');
    const [idError, setIdError] = useState(false);
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [nickError, setNickError] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const [isOpen, setIsOpen] = useRecoilState(signUpOpenState);
    const [snackbarOpen, setSnackbarOpen] = useRecoilState(snackOpenState);
    const [snackbarMessage, setSnackbarMessage] = useRecoilState(snackMessageState);
    const [snackbarType, setSnackbarType] = useRecoilState(snackTypeState);

    const handleSnackBar = useCallback((type, msg) => {
        setSnackbarType(type);
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
    }, [setSnackbarType, setSnackbarMessage, setSnackbarOpen]);

    const handleModal = useCallback((bool) => {
        setIsOpen(bool);

        if (!bool) {
            setId('');
            setPassword('');
            setNickname('');
            setEmail('');
        }
    }, [setIsOpen, setId, setPassword, setNickname, setEmail]);

    const getSignUp = useCallback(async () => {
        if (idError || nickError || emailError || !emailValid || id.trim() === '' || nickname.trim() === '' || email.trim() === '') {
            handleSnackBar('warning', '입력값을 확인해주세요.');
            return;
        }

        try {
            const response = await axios.post('https://api.sisyphusj.me/api/member/register', {
                username: id,
                password: password,
                nickname: nickname,
                email: email,
            });

            if (response.status === 200) {
                handleSnackBar('success', '회원가입이 완료되었습니다.');
                handleModal(false);
            }
        } catch (e) {
            console.error(e);
            handleSnackBar('error', '회원가입 중 오류가 발생했습니다.');
        }
    }, [id, password, nickname, email, idError, nickError, emailError, emailValid, handleSnackBar, handleModal]);

    const checkDuplicatedId = useCallback(async () => {
        if (id.trim() === '') {
            setIdError(false);
            return;
        }

        try {
            const res = await api.get(`/api/member/check/username/${id}`);
            setIdError(res.status === 200 && res.data === true);
        } catch (e) {
            console.log(e.response);
            handleSnackBar('error', '서버에 문제가 생겼습니다. 다시 시도해주세요.');
        }
    }, [id, handleSnackBar]);

    const checkDuplicatedNick = useCallback(async () => {
        if (nickname.trim() === '') {
            setNickError(false);
            return;
        }

        try {
            const res = await api.get(`/api/member/check/nickname/${nickname}`);
            setNickError(res.status === 200 && res.data === true);
        } catch (e) {
            console.log(e.response);
            handleSnackBar('error', '서버에 문제가 생겼습니다. 다시 시도해주세요.');
        }
    }, [nickname, handleSnackBar]);

    const checkDuplicatedEmail = useCallback(async () => {
        setEmailValid(true);

        if (email.trim() === '') {
            setEmailError(false);
            return;
        }

        if (!validateEmail(email)) {
            setEmailValid(false);
            return;
        }

        try {
            const res = await api.get(`/api/member/check/email/${email}`);
            setEmailError(res.status === 200 && res.data === true);
        } catch (e) {
            console.log(e.response);
            handleSnackBar('error', '서버에 문제가 생겼습니다. 다시 시도해주세요.');
        }
    }, [email, handleSnackBar]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleEmailHelpText = () => {
        if (!emailValid) {
            return '이메일 형식이 올바르지 않습니다.';
        } else if (emailError) {
            return '이미 존재하는 이메일입니다.';
        } else {
            return '';
        }
    }

    return {
        id,
        setId,
        idError,
        password,
        setPassword,
        nickname,
        setNickname,
        nickError,
        email,
        setEmail,
        emailError,
        emailValid,
        isOpen,
        handleModal,
        getSignUp,
        checkDuplicatedId,
        checkDuplicatedNick,
        checkDuplicatedEmail,
        handleEmailHelpText
    };
}

export default useSignup;
