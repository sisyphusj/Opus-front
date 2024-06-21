import React, { useEffect } from 'react';
import CustomModal from '../CommonModal';
import { CustomButton } from '../CommonModal';
import { ReactComponent as LightLogo } from "../../assets/lightlogo.svg";
import SignupInputFields from './SignupInputFields';
import useSignup from '../../hooks/useSignup';
import styled from 'styled-components';

const SignupModal = () => {
  const {
    id, setId, idError, password, setPassword,
    nickname, setNickname, nickError,
    email, setEmail, emailError, emailValid,
    isOpen, handleModal, getSignUp, checkDuplicatedId,
    checkDuplicatedNick, checkDuplicatedEmail, handleEmailHelpText
  } = useSignup();

  useEffect(() => {
    handleModal(true);
    console.log(isOpen);

    return () => {
      handleModal(false);
      console.log(isOpen);
    }
  }, [handleModal, isOpen]);

  return (
      <CustomModal isOpen={isOpen} handleModal={handleModal} type={"md"}>
        <CustomLogo />
        <SignupInputFields
            id={id}
            setId={setId}
            idError={idError}
            checkDuplicatedId={checkDuplicatedId}
            password={password}
            setPassword={setPassword}
            nickname={nickname}
            setNickname={setNickname}
            nickError={nickError}
            checkDuplicatedNick={checkDuplicatedNick}
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            emailValid={emailValid}
            checkDuplicatedEmail={checkDuplicatedEmail}
            handleEmailHelpText={handleEmailHelpText}
        />
        <CustomButton style={{ marginTop: "45px" }} onClick={() => getSignUp()}>Sign Up</CustomButton>
      </CustomModal>
  );
}

const CustomLogo = styled(LightLogo)`
  width: 200px;
  height: 100px;
  margin-bottom: 20px;
`;

export default SignupModal;
