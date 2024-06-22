import React from 'react';
import { CustomLogo, CustomTextLogo, CustomButton } from '../CommonModal';
import LoginInputFields from './LoginInputFields';
import styled from 'styled-components';

const LoginModalContent = ({ id, setId, password, setPassword, onLogin, onSignup }) => (
    <>
        <CustomLogo />
        <CustomTextLogo />
        <LoginInputFields id={id} setId={setId} password={password} setPassword={setPassword} />
        <CustomButton onClick={onLogin}> 로그인 </CustomButton>
        <SignupPrompt>
            계정이 없으신가요?
            <StyledLink onClick={onSignup}>회원가입</StyledLink>
        </SignupPrompt>
    </>
);

const SignupPrompt = styled.p`
  margin-top: 20px;
`;

const StyledLink = styled.span`
  color: darkblue;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 5px;
`;

export default LoginModalContent;
