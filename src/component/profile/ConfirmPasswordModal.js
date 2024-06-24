import React, {useEffect, useState} from 'react';
import {Box, Flex, Heading, TextField} from 'gestalt';
import styled from 'styled-components';
import {DeleteButton} from "../buttons/ActionButtons";
import api from "../../api";
import useSnackbar from "../../hooks/useSnackbar";

const ConfirmPasswordModal = ({ message, setIsCorrect, onCancel, handleFieldBorder, confirmPwFieldRef}) => {

    const [password, setPassword] = useState("");
    const {showSnackbar } = useSnackbar();

    const handleOnKeyDown = (e) => {
        if (e.key === "Enter") {
           checkPassword();
        }
    }

    const checkPassword = async () => {

        if(password === "") {
            showSnackbar('warning', '비밀번호를 입력해주세요.');
            return;
        }

        if(password.trim() === "") {
            showSnackbar('warning', '공백은 입력할 수 없습니다.');
            return;
        }

        try {
            const response = await api.post(`/api/member/confirm/password`, {
                password : password
            });

            console.log(response);

            if(response.status === 200) {
                if(response.data === false) {
                    showSnackbar('error', '비밀번호가 일치하지 않습니다.');
                    setIsCorrect(false);
                } else {
                    setIsCorrect(true);
                }
            }

        } catch (e) {
            console.error(e);
        }
    }
    return (
    <Background>
        <CheckSaveBox>
            <Heading color="dark" size="400">{message}</Heading>
            <Flex>
                <Box marginTop={6}>
                    <TextField id="userNewPw" type="password" size="lg"
                               onChange={(e) => setPassword(e.value)}
                               value={password || ""}
                               onKeyDown={(e) => handleOnKeyDown(e)}
                               ref={confirmPwFieldRef}
                               onFocus={() => handleFieldBorder(confirmPwFieldRef, true)}
                               onBlur={() => handleFieldBorder(confirmPwFieldRef, false)}
                    />

                    <DeleteButton onClick={() => checkPassword()} style = {{marginTop : "20px"}}>네</DeleteButton>
                    <DeleteButton onClick={onCancel} style={{ marginLeft: "20px" }}>아니요</DeleteButton>
                </Box>
            </Flex>
        </CheckSaveBox>
    </Background>
    );
};

export default ConfirmPasswordModal;

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

