import React from 'react';
import { Box, Flex, Heading } from 'gestalt';
import styled from 'styled-components';
import {DeleteButton} from "../buttons/ActionButtons";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
    <Background>
        <CheckSaveBox>
            <Heading color="dark" size="400">{message}</Heading>
            <Flex>
                <Box marginTop={6}>
                    <DeleteButton onClick={onConfirm}>네</DeleteButton>
                    <DeleteButton onClick={onCancel} style={{ marginLeft: "20px" }}>아니요</DeleteButton>
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
  z-index: 999;
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
  z-index: 1000;
`;

export default ConfirmationModal;
