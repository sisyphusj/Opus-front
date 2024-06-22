import React from 'react';
import { CustomInput } from '../CommonModal';

const LoginInputFields = ({ id, setId, password, setPassword }) => (
    <>
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
    </>
);

export default LoginInputFields;
