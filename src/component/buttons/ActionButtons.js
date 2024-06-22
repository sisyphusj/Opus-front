import React from 'react';
import { Box, Flex } from 'gestalt';
import styled from 'styled-components';

const ActionButtons = ({ setIsSave, setIsDelete }) => (
    <Flex justifyContent="end">
        <Box marginTop={12} marginEnd={6}>
            <SaveButton onClick={() => setIsSave(true)}>저장</SaveButton>
        </Box>
        <Box marginTop={12}>
            <DeleteButton onClick={() => setIsDelete(true)}>회원 탈퇴</DeleteButton>
        </Box>
    </Flex>
);

const SaveButton = styled.button`
  width: 150px;
  height: 50px;
  padding: 8px 16px;
  background-color: transparent;
  border-radius: 1.5rem;
  color: #F2709C;
  font-size: 20px;
  font-weight: bold;
  border: 1px solid #F2709C;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #F2709C;
    color: white;
  }
`;

export const DeleteButton = styled.button`
  width: 150px;
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

export default ActionButtons;
