import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { IconButton, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as TextLogo } from '../assets/textlogo.svg';
import { Mask } from "gestalt";

const CustomModal = ({ isOpen, handleModal, type, children }) => {
  const modalRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '1200px', height: '700px' });

  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth > 1300 ? "1200px" : '65vw',
      height: window.innerHeight > 800 ? "700px" : '75vh'
    });
  }, []);

  useLayoutEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = 'hidden';
    };
    const enableScroll = () => {
      document.body.style.overflow = 'auto';
    };

    if (isOpen) {
      disableScroll();
    } else {
      enableScroll();
    }

    return () => enableScroll();
  }, [isOpen]);

  return (
      <>
        {isOpen && (
            <Background>
              <Mask rounding={8}>
                {type === 'md' ? (
                    <ModalContent ref={modalRef}>
                      <CloseButton handleClose={() => handleModal(false)} />
                      <ContentBox>{children}</ContentBox>
                    </ModalContent>
                ) : type === 'lg' ? (
                    <PinModalContent ref={modalRef} width={dimensions.width} height={dimensions.height}>
                      <CloseButton handleClose={() => handleModal(false)} absolute />
                      <ContentBox>{children}</ContentBox>
                    </PinModalContent>
                ) : null}
              </Mask>
            </Background>
        )}
      </>
  );
};

const CloseButton = ({ handleClose, absolute = false }) => (
    <CloseBox absolute={absolute}>
      <IconButton onClick={handleClose}>
        <Close fontSize={'large'} />
      </IconButton>
    </CloseBox>
);

export const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  width: 450px;
  height: 650px;
  background: white;
  padding: 20px;
`;

const PinModalContent = styled.div`
  width: ${({ width }) => width};
  min-width: 450px;
  height: ${({ height }) => height};
  min-height: 650px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
`;

const CloseBox = styled.div`
  display: flex;
  justify-content: flex-end;
  position: ${({ absolute }) => (absolute ? 'absolute' : 'static')};
  right: ${({ absolute }) => (absolute ? '20px' : 'auto')};
  z-index: 999;
`;

const ContentBox = styled.div`
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
  '& .MuiFormHelperText-root': {
    color: '#B2BAC2',
    '&.Mui-error': {
      color: '#F2709C',
    },
  },

  backgroundColor: 'white',
});

export const CustomButton = styled.button`
  width: 250px;
  height: 50px;
  padding: 8px 16px;
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
