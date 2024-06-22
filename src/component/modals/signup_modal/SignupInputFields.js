import React from 'react';
import { CustomInput } from '../CommonModal';
import { Box } from '@mui/material';

const SignupInputFields = ({
    id, setId, idError, checkDuplicatedId,
    password, setPassword,
    nickname, setNickname, nickError, checkDuplicatedNick,
    email, setEmail, emailError, emailValid, checkDuplicatedEmail, handleEmailHelpText
}) => (
    <>
        <CustomInput
            id="id_field"
            onChange={(e) => setId(e.target.value)}
            label="아이디"
            value={id}
            size="normal"
            margin="dense"
            onBlur={() => checkDuplicatedId()}
            helperText={idError ? '이미 존재하는 아이디입니다.' : ''}
            InputProps={{
                sx: {
                    borderRadius: '1.5rem',
                    width: '250px',
                },
            }}
        />
        <Box marginTop={"15px"}>
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
                        width: '250px',
                    },
                }}
            />
        </Box>
        <Box marginTop={"20px"}>
            <CustomInput
                id="nick_field"
                onChange={(e) => setNickname(e.target.value)}
                label="닉네임"
                value={nickname}
                size="normal"
                onBlur={() => checkDuplicatedNick()}
                helperText={nickError ? '이미 존재하는 닉네임입니다.' : ''}
                InputProps={{
                    sx: {
                        borderRadius: '1.5rem',
                        width: '250px',
                    },
                }}
            />
        </Box>
        <Box marginTop={"20px"}>
            <CustomInput
                id="email_field"
                onChange={(e) => setEmail(e.target.value)}
                label="이메일"
                value={email}
                size="normal"
                onBlur={() => checkDuplicatedEmail()}
                helperText={handleEmailHelpText()}
                InputProps={{
                    sx: {
                        borderRadius: '1.5rem',
                        width: '250px',
                    },
                }}
            />
        </Box>
    </>
);

export default SignupInputFields;
