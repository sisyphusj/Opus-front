import api from "../../api";
import {useEffect, useRef, useState} from "react";
import {Box, Button, Flex, Heading, Text, TextField} from "gestalt";
import styled from "styled-components";
import LoadingIndicator from "../../component/LoadingIndicator";
import {Background, CustomButton} from "../../component/CommonModal";
import {removeCookieToken} from "../../Cookies";
import {useRecoilState} from "recoil";
import {
  isLoginState,
  snackMessageState,
  snackOpenState,
  snackTypeState
} from "../../atom";
import {useNavigate} from "react-router-dom";

export default function MyProfile() {

  const navigate = useNavigate();
  const [changePw, setChangePw] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [isDelete, setIsDelete] = useState(false)
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  const idFieldRef = useRef(null);
  const pwFieldRef = useRef(null);
  const newPwFieldRef = useRef(null);
  const nicknameFieldRef = useRef(null);
  const emailFieldRef = useRef(null);

  const [id, setId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useRecoilState(snackOpenState);
  const [snackbarMessage, setSnackbarMessage] = useRecoilState(
      snackMessageState);
  const [snackbarType, setSnackbarType] = useRecoilState(snackTypeState);

  const handleSnackBar = (type, msg) => {
    setSnackbarType(type);
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  }

  const getProfile = async () => {
    try {
      const response = await api.get('/api/member/profile');

      setId(response.data.username);
      setNickname(response.data.nickname);
      setEmail(response.data.email);
      setOldPassword(response.data.password)
    } catch (e) {
      console.log(e);
      handleSnackBar('error', '프로필을 불러오는데 실패했습니다.')
    }
  }

  const submitProfile = async () => {

    if (id.trim() === '' || password.trim() === '' || nickname.trim() === ''
        || email.trim() === '') {
      handleSnackBar('error', '입력값을 확인하세요');
      return;
    }

    try {
      await api.put('/api/member', {
        username: id,
        password: changePw ? newPassword : oldPassword,
        nickname: nickname,
        email: email,
      });

      setIsSave(false);
      handleSnackBar('success', '프로필이 성공적으로 저장되었습니다.')

    } catch (e) {
      console.log(e);
      handleSnackBar('error', '프로필을 저장하는데 실패했습니다.')
    }
  }

  const deleteProfile = async () => {

    try {
      const response = await api.delete('/api/member');
      if (response.status === 200) {
        sessionStorage.removeItem('accessToken');
        removeCookieToken();

        handleSnackBar('success', '회원 탈퇴가 완료되었습니다.')

        setIsLogin(false);
        navigate('/');
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
      handleSnackBar('error', '회원 탈퇴에 실패했습니다.')
    }

    setIsDelete(false);
  }

  const handleFieldBorder = (ref, boolean) => {
    ref.current.style.boxShadow = "none";
    if (boolean) {
      ref.current.style.borderColor = "#F2709C";
    } else {
      ref.current.style.borderColor = "#cdcdcd";
    }
  }

  const handelChangeButton = (bool) => {
    setChangePw(bool);
    if (bool === false) {
      setNewPassword('');
      setPassword('');
    }
  }

  useEffect(() => {

    if (!isLogin) {
      handleSnackBar('warning', '로그인 후 이용해주세요.');
      return (navigate('/'));
    }

    getProfile();
  }, []);

  return (
      <Box minHeight={"calc(100vh - 154px)"}>
        <Box marginBottom={6}>
          <Heading> 계정 관리 </Heading>
        </Box>

        <Box maxWidth={400}>
          <TextField id={"userid"} size={"lg"} onChange={(e) => setId(e.value)}
                     value={id || ""} label={"아이디"}
                     ref={idFieldRef}
                     onFocus={() => handleFieldBorder(idFieldRef, true)}
                     onBlur={() => handleFieldBorder(idFieldRef, false)}
          />

          <Box marginTop={8}>
            <Flex justifyContent={"between"}>
              <Box minWidth={300}>
                <TextField id={"userPw"} type={"password"} size={"lg"}
                           onChange={(e) => setPassword(e.value)}
                           value={password || ""} label={"새로운 비밀번호"}
                           ref={pwFieldRef}
                           onFocus={() => handleFieldBorder(pwFieldRef, true)}
                           onBlur={() => handleFieldBorder(pwFieldRef, false)}
                />
              </Box>
              <Box marginTop={6} marginStart={3}>
                {changePw ? <ChangeButton
                        onClick={() => handelChangeButton(false)}>취소</ChangeButton>
                    :
                    <ChangeButton onClick={() => handelChangeButton(true)}
                    >변경</ChangeButton>}
              </Box>
            </Flex>

            {changePw &&
                <Box width={300}>
                  <TextField id={"userNewPw"} type={"password"} size={"lg"}
                             onChange={(e) => setNewPassword(e.value)}
                             value={newPassword || ""}
                             label={"비밀번호 확인"}
                             ref={newPwFieldRef}
                             errorMessage={!(newPassword === password)
                                 ? "비밀번호가 일치하지 않습니다." : null}
                             onFocus={() => handleFieldBorder(newPwFieldRef,
                                 true)}
                             onBlur={() => handleFieldBorder(newPwFieldRef,
                                 false)}
                  />
                </Box>
            }

          </Box>

          <Box marginTop={8}>
            <TextField id={"userNickname"} size={"lg"}
                       onChange={(e) => setNickname(e.value)}
                       value={nickname || ""} label={"닉네임"}

                       ref={nicknameFieldRef}
                       onFocus={() => handleFieldBorder(nicknameFieldRef, true)}
                       onBlur={() => handleFieldBorder(nicknameFieldRef, false)}
            />
          </Box>

          <Box marginTop={8}>
            <TextField id={"userEmail"} size={"lg"}
                       onChange={(e) => setEmail(e.value)} value={email || ""}
                       label={"이메일"}

                       ref={emailFieldRef}
                       onFocus={() => handleFieldBorder(emailFieldRef, true)}
                       onBlur={() => handleFieldBorder(emailFieldRef, false)}

            />
          </Box>
        </Box>

        <Flex justifyContent={"end"}>
          <Box marginTop={12} marginEnd={6}>
            <SaveButton onClick={() => setIsSave(true)}> 저장 </SaveButton>
          </Box>

          <Box marginTop={12}>
            <DeleteButton onClick={() => setIsDelete(true)}> 회원
              탈퇴 </DeleteButton>
          </Box>
        </Flex>

        {isSave && <Background>
          <CheckSaveBox>
            <Heading color={"dark"} size={"400"}>변경사항을 저장하시겠습니까?</Heading>
            <Flex>
              <Box marginTop={6}>
                <ChangeButton onClick={() => submitProfile()}> 네</ChangeButton>
                <ChangeButton onClick={() => setIsSave(false)} style={{
                  marginLeft: "20px"
                }}> 아니요</ChangeButton>
              </Box>
            </Flex>
          </CheckSaveBox>
        </Background>}

        {isDelete && <Background>
          <CheckSaveBox>
            <Heading color={"dark"} size={"400"}>정말로 회원 탈퇴하시겠습니까?</Heading>
            <Flex>
              <Box marginTop={6}>
                <ChangeButton onClick={() => deleteProfile()}> 네</ChangeButton>
                <ChangeButton onClick={() => setIsDelete(false)} style={{
                  marginLeft: "20px"
                }}> 아니요</ChangeButton>
              </Box>
            </Flex>
          </CheckSaveBox>
        </Background>}

      </Box>
  );
}

const SaveButton = styled(CustomButton)`
  width: 150px;
`;

const DeleteButton = styled(CustomButton)`
  width: 150px;
  border: 1px solid #F2709C;
  color: #F2709C;

  &:hover {
    background: #F2709C;
    color: white;
  }
`;

const ChangeButton = styled(CustomButton)`
  width: 90px;
  height: 49px;
  border-radius: 1rem;
  font-size: 16px;
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