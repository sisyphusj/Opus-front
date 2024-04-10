// LoginModal.js
import React, {useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {CustomLogo, CustomTextLogo, CustomInput, LoginButton} from './CommonModal';
import CustomModal from './CommonModal';
import {Button} from 'gestalt';
import SignupModal from "./SignupModal";
import {useRecoilState} from "recoil";
import {signUpOpenState} from "../atom";

const LoginModal = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useRecoilState(signUpOpenState);

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
            console.log(response);
            handleModal(false);
        } catch (e) {
            console.log(e);
        }
    };

    const handleSignup = () => {
        setIsOpen(false);
        setSignupOpen(true);
    };

    return (
        <div>
            <Button text={'로그인'} color={'gray'} size={'lg'} onClick={() => handleModal(true)}></Button>
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
                <LoginButton onClick={() => login()}> 로그인 </LoginButton>
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


