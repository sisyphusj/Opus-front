// LoginModal.js
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import api from '../api';
import {CustomLogo, CustomTextLogo, CustomInput, CustomButton} from './CommonModal';
import CustomModal from './CommonModal';
import {Button} from 'gestalt';
import SignupModal from "./SignupModal";
import {useRecoilState} from "recoil";
import {signUpOpenState, isLoginState} from "../atom";

const LoginModal = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useRecoilState(signUpOpenState);
    const [isLogin, setIsLogin] = useRecoilState(isLoginState);

    const handleModal = (bool) => {
        setIsOpen(bool);

        if (!bool) {
            setId('');
            setPassword('');
        }
    };

    const login = () => {
        try {
            const response = api.post('/member/login', {
                id: id,
                pw: password,
            });

            response.then((res) => {
                if(res.data === "로그인 성공") {
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

            response.then((res) => {
                if(res.data === "로그아웃 성공") {
                    setIsLogin(false);
                }
            });

            console.log(response);

            handleModal(false);
        } catch (e) {
            console.log(e);
        }
    }

    const handleSignup = () => {
        setIsOpen(false);
        setSignupOpen(true);
    };

    useEffect(() => {
        console.log(isLogin);
    }, [isLogin]);

    return (
        <div>
            {!isLogin ? <Button text={'로그인'} color={'gray'} size={'lg'} onClick={() => handleModal(true)} />
                : <Button text={'로그아웃'} color={'gray'} size={'lg'} onClick={() => logout()} />}
            {/*<Button text={'로그인'} color={'gray'} size={'lg'} onClick={() => handleModal(true)}></Button>*/}
            <CustomModal isOpen={isOpen} handleModal={handleModal}>
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
            </CustomModal>
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


