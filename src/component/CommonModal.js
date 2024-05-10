// CommonModal.js
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {IconButton, TextField} from '@mui/material';
import {Close} from '@mui/icons-material';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {ReactComponent as TextLogo} from '../assets/textlogo.svg';
import {Mask} from "gestalt";


const CustomModal = ({isOpen, handleModal, type, children}) => {
    const modalRef = useRef(null);
    const [w, setW] = useState("1200px");
    const [h, setH] = useState("700px");

    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleModal(false);
        }
    };

    useLayoutEffect(() => {
        function updateDirection() {
            setW(window.innerWidth > 1300 ? "1200px" : '65vw');
            setH(window.innerHeight > 800 ? "700px" : '75vh');
        }

        updateDirection();

        window.addEventListener('resize', updateDirection);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => window.removeEventListener('resize', updateDirection);
    }, []);

    const disableScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        // 스크롤 막기
        document.body.style.overflow = 'hidden';
        window.scrollTo(scrollLeft, scrollTop);
    }

    const enableScroll = () => {
        document.body.style.overflow = 'auto';
    }

    useEffect(() => {
        disableScroll();

        return () => {
            enableScroll();
        }
    }, []);

    return (
        <>
            {isOpen && (
                <Background onClick={(e) => handleOverlayClick(e)}>
                    <Mask rounding={8}>
                    {type === 'md'
                        ? (<Main ref={modalRef}>
                            <CloseBox>
                                <IconButton onClick={() => handleModal(false)}>
                                    <Close fontSize={'large'}/>
                                </IconButton>
                            </CloseBox>
                            <LoginBox>{children}</LoginBox>
                        </Main>)
                        : type === 'lg' ? (
                            <PinMain ref={modalRef} props = {w} props1 = {h}>
                                <PinCloseBox>
                                    <IconButton onClick={() => handleModal(false)}>
                                        <Close fontSize={'large'}/>
                                    </IconButton>
                                </PinCloseBox>
                                <LoginBox>{children}</LoginBox>
                            </PinMain>
                        ) : null
                    }
                    </Mask>
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
    //border-radius: 8px;
`;

export const PinMain = styled.div`
    
    width: ${({props}) => props};
    min-width: 450px;
    height: ${({props1}) => props1};
    min-height: 650px;
    background: white;
    padding: 20px;
    border-radius: 8px;
`;

const CloseBox = styled.div`
    display: flex;
    justify-content: flex-end;

`;

const PinCloseBox = styled.div`
    position: absolute;
    right: 20px;
    z-index: 999;
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
