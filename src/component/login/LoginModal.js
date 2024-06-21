import React, { useEffect, useState } from 'react';
import { Button } from 'gestalt';
import CustomModal from '../CommonModal';
import SignupModal from "../signup/SignupModal";
import useLogin from '../../hooks/useLogin';
import LoginModalContent from './LoginModalContent';
import { useRecoilState } from 'recoil';
import { signUpOpenState } from '../../atom';

const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useRecoilState(signUpOpenState);
  const { id, setId, password, setPassword, isLogin, login, logout } = useLogin();

  const handleModal = (bool) => {
    setIsOpen(bool);
    if (!bool) {
      setId('');
      setPassword('');
    }
  };

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
        {!isLogin ? (
            <Button text={'로그인'} color={'gray'} size={'lg'} onClick={() => handleModal(true)} />
        ) : (
            <Button text={'로그아웃'} color={'gray'} size={'lg'} onClick={() => logout()} />
        )}
        {isOpen && (
            <CustomModal isOpen={isOpen} handleModal={handleModal} type={"md"}>
              <LoginModalContent
                  id={id}
                  setId={setId}
                  password={password}
                  setPassword={setPassword}
                  onLogin={() => login(handleModal)} // handleModal을 인자로 전달
                  onSignup={handleSignup}
              />
            </CustomModal>
        )}
        {signupOpen && <SignupModal />}
      </div>
  );
};

export default LoginModal;
