import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import api from '../api';
import CustomModal, {
  CustomLogo,
  CustomTextLogo,
  CustomInput,
  CustomButton
} from './CommonModal';
import {Button} from 'gestalt';
import SignupModal from "./SignupModal";
import {useRecoilState} from "recoil";
import {
  signUpOpenState,
  isLoginState,
  snackOpenState,
  snackMessageState,
  snackTypeState
} from "../atom";
import {useNavigate} from "react-router-dom";
import {removeCookieToken, setRefreshToken} from "../Cookies";
import axios from "axios";

const LoginModal = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useRecoilState(signUpOpenState);
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useRecoilState(snackOpenState);
  const [snackbarMessage, setSnackbarMessage] = useRecoilState(
      snackMessageState);
  const [snackbarType, setSnackbarType] = useRecoilState(snackTypeState);

  const handleModal = (bool) => {
    setIsOpen(bool);

    if (!bool) {
      setId('');
      setPassword('');
    }
  };

  const handleSnackBar = (type, msg) => {
    setSnackbarType(type);
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  }

  const login = async () => {

    if (id.trim() === '' || password.trim() === '') {
      handleSnackBar('warning', '아이디 또는 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login',
          {
            username: id,
            password: password,
          });

      if (response.status === 200) {
        setRefreshToken(response.data.refreshToken);
        sessionStorage.setItem('accessToken', response.data.accessToken);
        console.log(sessionStorage.getItem('accessToken'));
        setIsLogin(true);
        handleSnackBar('success', '로그인하였습니다.');
      }

      handleModal(false);
    } catch (e) {
      if (e.response.data.code === "E001") {
        handleSnackBar('error', '아이디 또는 비밀번호가 맞지 않습니다.');
      } else {
        handleSnackBar('error', '로그인 중 오류가 발생했습니다.');
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');

      removeCookieToken();
      sessionStorage.removeItem('accessToken');
      setIsLogin(false);

      handleModal(false);
      setIsLogin(false);
      navigate('/');
      // window.location.reload();
      handleSnackBar('info', '로그아웃하였습니다.');
    } catch (e) {
      console.error(e);
      handleModal(false);
      setIsLogin(false);
      navigate('/');
      window.location.reload();
    }
  }

  const handleSignup = () => {
    setIsOpen(false);
    setSignupOpen(true);
  };

  useEffect(() => {
    setId('');
    setPassword('');
  }, [isOpen]);

  return (
      <div>
        {!isLogin ? <Button text={'로그인'} color={'gray'} size={'lg'}
                            onClick={() => handleModal(true)}/>
            : <Button text={'로그아웃'} color={'gray'} size={'lg'}
                      onClick={() => logout()}/>}
        {isOpen && <CustomModal isOpen={isOpen} handleModal={handleModal}
                                type={"md"}>
          <CustomLogo/>
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
          <CustomButton onClick={() => login()}> 로그인 </CustomButton>
          <p style={{marginTop: '20px'}}> 계정이 없으신가요?
            <StyledLink onClick={() => handleSignup()}
                        style={{marginLeft: '5px'}}>회원가입</StyledLink>
          </p>
        </CustomModal>}
        {signupOpen && <SignupModal/>}
      </div>
  );
};
const StyledLink = styled.span`
  color: darkblue;
  text-decoration: underline;
  cursor: pointer;
`;

export default LoginModal;


