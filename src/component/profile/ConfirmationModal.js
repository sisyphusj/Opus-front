import React from 'react';
import { Box, Flex, Heading } from 'gestalt';
import styled from 'styled-components';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
    <Background>
        <CheckSaveBox>
            <Heading color="dark" size="400">{message}</Heading>
            <Flex>
                <Box marginTop={6}>
                    <ChangeButton onClick={onConfirm}>네</ChangeButton>
                    <ChangeButton onClick={onCancel} style={{ marginLeft: "20px" }}>아니요</ChangeButton>
                </Box>
            </Flex>
        </CheckSaveBox>
    </Background>
);

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CheckSaveBox = styled.div`
  width: 450px;
  height: 200px;
  border-radius: 1rem;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ChangeButton = styled.button`
  width: 90px;
  height: 49px;
  border-radius: 1rem;
  font-size: 16px;
  background-color: #f2709c;
  color: white;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #d95d85;
  }
`;

export default ConfirmationModal;
