// CommonModal.js
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import {IconButton, TextField} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as TextLogo } from '../assets/textlogo.svg';


const CustomModal = ({ isOpen, handleModal, children }) => {
    const modalRef = useRef(null);

    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleModal(false);
        }
    };

    return (
        <>
            {isOpen && (
                <Background onClick={(e) => handleOverlayClick(e)}>
                    <Main ref={modalRef}>
                        <CloseBox>
                            <IconButton onClick={() => handleModal(false)}>
                                <Close fontSize={'large'} />
                            </IconButton>
                        </CloseBox>
                        <LoginBox>{children}</LoginBox>
                    </Main>
                </Background>
            )}
        </>
    );
};

export const Background = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* 투명한 검은 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

export const Main = styled.div`
    width: 450px;
    height: 650px;
    background: white;
    padding: 20px;
    border-radius: 8px;
`;

const CloseBox = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const LoginBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;


export const CustomLogo = styled(Logo)`
    width: 170px;
    height: 170px;
    margin-bottom: 20px;
`;

export const CustomTextLogo = styled(TextLogo)`
    width: 100px;
    height: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const CustomInput = styled(TextField)({
    '& label.Mui-focused': {
        color: '#F2709C',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
            borderColor: '#F2709C',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#F2709C',
        },
    },
});

export const CustomButton = styled.button`
    width: 250px;
    height: 50px;
    padding: 8px 16px;
    border: none;
    background-color: transparent;
    border-radius: 1.5rem;
    color: #ff9472;
    font-size: 20px;
    font-weight: bold;
    border: 1px solid #ff9472;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background: #ff9472;
        color: white;
    }
`;

export default CustomModal;
