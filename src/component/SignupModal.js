import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CustomModal from './CommonModal';
import {CustomInput, CustomButton } from './CommonModal';
import {ReactComponent as LightLogo} from "../assets/lightlogo.svg";
import {useRecoilState} from "recoil";
import {signUpOpenState} from "../atom";
import styled from "styled-components";

const SignupModal = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [isOpen , setIsOpen] = useRecoilState(signUpOpenState);

    const handleModal = (bool) => {
        setIsOpen(bool);

        if (!bool) {
            setId('');
            setPassword('');
            setNickname('');
            setEmail('');
        }
    };

    const getSingUp = async () => {
        try {
            const response = await axios.post('http://localhost:8080/member/signup', {
                id: id,
                pw: password,
                nick: nickname,
                email: email,
            });
            console.log(response);

            if(response.status === 200) {
                handleModal(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        handleModal(true);
        console.log(isOpen);

        return () => {
            handleModal(false);
            console.log(isOpen);
        }
    }, []);

    return (
        <CustomModal isOpen={isOpen} handleModal={handleModal}>
            <CustomLogo />
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
                        marginBottom: '20px',
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
            <CustomInput
                id="nick_field"
                onChange={(e) => setNickname(e.target.value)}
                label="닉네임"
                value={nickname}
                size="normal"
                InputProps={{
                    sx: {
                        borderRadius: '1.5rem',
                        marginBottom: '20px',
                        width: '250px',
                    },
                }}
            />
            <CustomInput
                id="email_field"
                onChange={(e) => setEmail(e.target.value)}
                label="이메일"
                value={email}
                size="normal"
                InputProps={{
                    sx: {
                        borderRadius: '1.5rem',
                        marginBottom: '45px',
                        width: '250px',
                    },
                }}
            />
            <CustomButton onClick={() => getSingUp()}>Sign Up</CustomButton>
        </CustomModal>
    );
};

const CustomLogo = styled(LightLogo)`
    width: 200px;
    height: 100px;
    margin-bottom: 20px;
`;

export default SignupModal;
