// LoginModal.js
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import api from '../api';
import CustomModal, {CustomLogo, CustomTextLogo, CustomInput, CustomButton} from './CommonModal';
import {Button} from 'gestalt';
import SignupModal from "./SignupModal";
import {useRecoilState} from "recoil";
import {signUpOpenState, isLoginState} from "../atom";
import {useNavigate} from "react-router-dom";
import {removeCookieToken, setRefreshToken} from "../Cookies";
import axios from "axios";

const LoginModal = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useRecoilState(signUpOpenState);
    const [isLogin, setIsLogin] = useRecoilState(isLoginState);
    const navigate = useNavigate();

    const handleModal = (bool) => {
        setIsOpen(bool);

        if (!bool) {
            setId('');
            setPassword('');
        }
    };

    const login = () => {
        try {
            const response = axios.post('http://localhost:8080/member/login', {
                id: id,
                pw: password,
            });

            response.then((res) => {
                if(res.status === 200) {
                    setRefreshToken(res.data.refreshToken);
                    sessionStorage.setItem('accessToken', res.data.accessToken);
                    console.log(sessionStorage.getItem('accessToken'));
                    setIsLogin(true);
                }
            });

            console.log(response);

            handleModal(false);
        } catch (e) {
            console.log(e);
        }
    };

    const logout = () => {
        try {
            const response = api.get('/member/logout', {
                id: id,
                pw: password,
            });

            console.log(response);

            response.then((res) => {
                if(res.status === 200) {
                    removeCookieToken();
                    sessionStorage.removeItem('accessToken');
                    setIsLogin(false);
                }
            });

            console.log(response);
            handleModal(false);
            // 지워야 함
            setIsLogin(false);
            navigate('/');
        } catch (e) {
            console.log(e);
        }
    }

    const handleSignup = () => {
        setIsOpen(false);
        setSignupOpen(true);
    };

    useEffect(() => {
    }, []);

    return (
        <div>
            {!isLogin ? <Button text={'로그인'} color={'gray'} size={'lg'} onClick={() => handleModal(true)} />
                : <Button text={'로그아웃'} color={'gray'} size={'lg'} onClick={() => logout()} />}
            {isOpen && <CustomModal isOpen={isOpen} handleModal={handleModal} type={"md"}>
                <CustomLogo />
                <CustomTextLogo/>
                <CustomInput
                    id="id_field"
                    onChange={(e) => setId(e.target.value)}
                    label="아이디"
                    value={id}
                    size="normal"
                    margin="dense"
                    InputProps={{
                        sx: {
                            borderRadius: '1.5rem',
                            marginBottom: '15px',
                            width: '250px',
                        },
                    }}
                />
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
                            marginBottom: '20px',
                            width: '250px',
                        },
                    }}
                />
                <CustomButton onClick={() => login()}> 로그인 </CustomButton>
                <p style={{marginTop: '20px'}}> 계정이 없으신가요?
                    <StyledLink onClick={() => handleSignup()} style={{marginLeft: '5px'}}>회원가입</StyledLink>
                </p>
            </CustomModal>}
            {signupOpen && <SignupModal />}
        </div>
    );
};
const StyledLink = styled.span`
    color: darkblue;
    text-decoration: underline;
    cursor: pointer;
`;


export default LoginModal;


