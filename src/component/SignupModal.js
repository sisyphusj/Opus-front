import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CustomModal from './CommonModal';
import {CustomInput, CustomButton} from './CommonModal';
import {ReactComponent as LightLogo} from "../assets/lightlogo.svg";
import {useRecoilState} from "recoil";
import {signUpOpenState, snackMessageState, snackOpenState, snackTypeState} from "../atom";
import styled from "styled-components";
import api from "../api";
import {Box} from "@mui/material";

const SignupModal = () => {
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
    const [buttonActive, setButtonActive] = useState(false);

    const handleModal = (bool) => {
        setIsOpen(bool);

        if (!bool) {
            setId('');
            setPassword('');
            setNickname('');
            setEmail('');
        }
    };

    const handleSnackBar = (type, msg) => {
        setSnackbarType(type);
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
    }

    const getSignUp = async () => {

        console.log(buttonActive);

        if(!buttonActive) {
            handleSnackBar('warning', '입력값을 확인해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/member/signup', {
                id: id,
                pw: password,
                nick: nickname,
                email: email,
            });
            console.log(response);

            if (response.status === 200) {
                handleModal(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const checkDuplicatedId = async () => {

        console.log(id);

        if (id.trim() === '') {
            setIdError(false);
            return;
        }

        try {
            const res = await api.get(`/member/signup/check-id/${id}`);
            if (res.status === 200) {
                setIdError(false);
            }
        } catch (e) {
            if (e.response.data.status === 409) {
                setIdError(true);
            } else {
                console.log(e.response);
                handleSnackBar('danger', '서버에 문제가 생겼습니다. 다시 시도해주세요.');
            }
        }
    }

    const checkDuplicatedNick = async () => {

        if (nickname.trim() === '') {
            setNickError(false);
            return;
        }

        try {
            const res = await api.get(`/member/signup/check-nick/${nickname}`);
            if (res.status === 200) {
                setNickError(false);
            }
        } catch (e) {
            if (e.response.data.status === 409) {
                setNickError(true);
            } else {
                console.log(e.response);
                handleSnackBar('danger', '서버에 문제가 생겼습니다. 다시 시도해주세요.');
            }
        }
    }

    const checkDuplicatedEmail = async () => {

        setEmailValid(true);

        if (email.trim() === '') {
            setEmailError(false);
            return;
        }

        if (validateEmail(email) === false) {
            setEmailValid(false);
            return;
        }

        try {
            const res = await api.get(`/member/signup/check-email/${email}`);
            if (res.status === 200) {
                setEmailError(false);
            }
        } catch (e) {
            if (e.response.data.status === 409) {
                setEmailError(true);
            } else {
                console.log(e.response);
                handleSnackBar('danger', '서버에 문제가 생겼습니다. 다시 시도해주세요.');
            }
        }
    }

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


    useEffect(() => {
        handleModal(true);
        console.log(isOpen);

        return () => {
            handleModal(false);
            console.log(isOpen);
        }
    }, []);

    useEffect(() => {
        if (!idError && id.trim() !== '' && !nickError && nickname.trim() !== '' && !emailError && email.trim() !== '' && emailValid) {
            setButtonActive(true);
        }
    }, [idError, nickError, emailError, emailValid]);

    return (
        <CustomModal isOpen={isOpen} handleModal={handleModal} type={"md"}>
            <CustomLogo/>
            <CustomInput
                id="id_field"
                onChange={(e) => setId(e.target.value)}
                label="아이디"
                value={id}
                size="normal"
                margin="dense"
                onBlur={() => checkDuplicatedId()}
                helperText={idError ? '이미 존재하는 아이디입니다.' : ''}
                InputProps={{
                    sx: {
                        borderRadius: '1.5rem',
                        width: '250px',
                    },
                }}
            />
            <Box marginTop={"15px"}>
                <CustomInput
                    id="pw_field"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    label="비밀번호"
                    value={password}
                    size="normal"
                    InputProps={{
                        sx: {
                            borderRadius: '1.5rem',
                            width: '250px',
                        },
                    }}
                />
            </Box>
            <Box marginTop={"20px"}>
                <CustomInput
                    id="nick_field"
                    onChange={(e) => setNickname(e.target.value)}
                    label="닉네임"
                    value={nickname}
                    size="normal"
                    onBlur={() => checkDuplicatedNick()}
                    helperText={nickError ? '이미 존재하는 닉네임입니다.' : ''}
                    InputProps={{
                        sx: {
                            borderRadius: '1.5rem',
                            width: '250px',
                        },
                    }}
                />
            </Box>
            <Box marginTop={"20px"}>
                <CustomInput
                    id="email_field"
                    onChange={(e) => setEmail(e.target.value)}
                    label="이메일"
                    value={email}
                    size="normal"
                    onBlur={() => checkDuplicatedEmail()}
                    helperText={handleEmailHelpText()}
                    InputProps={{
                        sx: {
                            borderRadius: '1.5rem',
                            width: '250px',
                        },
                    }}
                />
            </Box>
            <CustomButton style={{marginTop: "45px"}} onClick={() => getSignUp()}>Sign Up</CustomButton>
        </CustomModal>
    );
};

const CustomLogo = styled(LightLogo)`
    width: 200px;
    height: 100px;
    margin-bottom: 20px;
`;

export default SignupModal;
