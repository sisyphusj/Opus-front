import React from 'react';
import { Box, TextField, Flex } from 'gestalt';
import styled from "styled-components";

const ProfileFields = ({
    id, setId,
    password, setPassword,
    newPassword, setNewPassword,
    nickname, setNickname,
    email, setEmail,
    changePw, handelChangeButton,
    handleFieldBorder,
    idFieldRef, pwFieldRef, newPwFieldRef, nicknameFieldRef, emailFieldRef
}) => (
    <Box maxWidth={400}>
        <TextField id="userid" size="lg" onChange={(e) => setId(e.value)}
                   value={id || ""} label="아이디"
                   ref={idFieldRef}
                   onFocus={() => handleFieldBorder(idFieldRef, true)}
                   onBlur={() => handleFieldBorder(idFieldRef, false)}
        />

        <Box marginTop={8}>
            <Flex justifyContent="between">
                <Box minWidth={300}>
                    <TextField id="userPw" type="password" size="lg"
                               onChange={(e) => setPassword(e.value)}
                               value={password || ""} label="새로운 비밀번호"
                               ref={pwFieldRef}
                               onFocus={() => handleFieldBorder(pwFieldRef,
                                   true)}
                               onBlur={() => handleFieldBorder(pwFieldRef,
                                   false)}
                    />
                </Box>
                <Box marginTop={6} marginStart={3}>
                    <ChangeButton onClick={() => handelChangeButton(!changePw)}>
                        {changePw ? '취소' : '변경'}
                    </ChangeButton>
                </Box>
            </Flex>

            {changePw && (
                <Box width={300}>
                    <TextField id="userNewPw" type="password" size="lg"
                               onChange={(e) => setNewPassword(e.value)}
                               value={newPassword || ""}
                               label="비밀번호 확인"
                               ref={newPwFieldRef}
                               errorMessage={!(newPassword === password)
                                   ? "비밀번호가 일치하지 않습니다." : null}
                               onFocus={() => handleFieldBorder(newPwFieldRef,
                                   true)}
                               onBlur={() => handleFieldBorder(newPwFieldRef,
                                   false)}
                    />
                </Box>
            )}
        </Box>

        <Box marginTop={8}>
            <TextField id="userNickname" size="lg"
                       onChange={(e) => setNickname(e.value)}
                       value={nickname || ""} label="닉네임"
                       ref={nicknameFieldRef}
                       onFocus={() => handleFieldBorder(nicknameFieldRef, true)}
                       onBlur={() => handleFieldBorder(nicknameFieldRef, false)}
            />
        </Box>

        <Box marginTop={8}>
            <TextField id="userEmail" size="lg"
                       onChange={(e) => setEmail(e.value)} value={email || ""}
                       label="이메일"
                       ref={emailFieldRef}
                       onFocus={() => handleFieldBorder(emailFieldRef, true)}
                       onBlur={() => handleFieldBorder(emailFieldRef, false)}
            />
        </Box>
    </Box>
);

const ChangeButton = styled.button`
  width: 85px;
  height: 50px;
  padding: 8px 16px;
  background-color: transparent;
  border-radius: 1.2rem;
  color: #F2709C;
  font-size: 17px;
  font-weight: bold;
  border: 1px solid #F2709C;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #F2709C;
    color: white;
  }
`;

export default ProfileFields;
