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
  background-color: #f2709c;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 1rem;
  
  &:hover {
    background-color: #d95d85;
  }
`;

const DeleteButton = styled.button`
  width: 150px;
  background-color: transparent;
  color: #f2709c;
  border: 1px solid #f2709c;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 1rem;
  
  &:hover {
    background-color: #f2709c;
    color: white;
  }
`;

export default ActionButtons;
