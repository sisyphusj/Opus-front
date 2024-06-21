import React, {useEffect, useRef, useState, useCallback} from "react";
import {Box, Heading} from "gestalt";
import api from "../../api";
import {useRecoilState} from "recoil";
import {isLoginState} from "../../atom";
import {useNavigate} from "react-router-dom";
import {removeCookieToken} from "../../Cookies";
import ProfileFields from "../../component/profile/ProfileFields";
import ActionButtons from "../../component/buttons/ActionButtons";
import ConfirmationModal from "../../component/profile/ConfirmationModal";
import useSnackbar from "../../hooks/useSnackbar";

export default function MyProfile() {
    const navigate = useNavigate();
    const [changePw, setChangePw] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isLogin, setIsLogin] = useRecoilState(isLoginState);

    const idFieldRef = useRef(null);
    const pwFieldRef = useRef(null);
    const newPwFieldRef = useRef(null);
    const nicknameFieldRef = useRef(null);
    const emailFieldRef = useRef(null);

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');

    const {showSnackbar} = useSnackbar();
    // 프로필 불러오기
    const getProfile = async () => {
        try {
            const response = await api.get('/api/member/profile');

            setId(response.data.username);
            setNickname(response.data.nickname);
            setEmail(response.data.email);
            setPassword(response.data.password); // 기존 비밀번호 설정
        } catch (e) {
            console.log(e);
            showSnackbar('error', '프로필을 불러오는데 실패했습니다.');
        }
    };

    // 프로필 제출
    const submitProfile = async () => {
        if (!id || !nickname || !email || (changePw && !newPassword)) {
            showSnackbar('error', '입력값을 확인하세요');
            return;
        }

        try {
            await api.put('/api/member', {
                username: id,
                password: changePw ? newPassword : password, // 변경된 비밀번호 또는 기존 비밀번호 사용
                nickname: nickname,
                email: email,
            });

            setIsSave(false);
            showSnackbar('success', '프로필이 성공적으로 저장되었습니다.');
        } catch (e) {
            console.log(e);
            showSnackbar('error', '프로필을 저장하는데 실패했습니다.');
        }
    };

    // 프로필 삭제
    const deleteProfile = async () => {
        try {
            const response = await api.delete('/api/member');
            if (response.status === 200) {
                sessionStorage.removeItem('accessToken');
                removeCookieToken();

                showSnackbar('success', '회원 탈퇴가 완료되었습니다.');
                setIsLogin(false);
                navigate('/');
                window.location.reload();
            }
        } catch (e) {
            console.log(e);
            showSnackbar('error', '회원 탈퇴에 실패했습니다.');
        }

        setIsDelete(false);
    };

    // 필드 테두리 처리
    const handleFieldBorder = useCallback((ref, active) => {
        ref.current.style.boxShadow = "none";
        ref.current.style.borderColor = active ? "#F2709C" : "#cdcdcd";
    }, []);

    const handelChangeButton = (bool) => {
        setChangePw(bool);
        if (!bool) {
            setNewPassword('');
            setPassword('');
        }
    };

    useEffect(() => {
        if (!isLogin) {
            showSnackbar('warning', '로그인 후 이용해주세요.');
            navigate('/');
            return;
        }

        getProfile();
    }, [isLogin, navigate, showSnackbar]);

    return (
        <Box minHeight={"calc(100vh - 154px)"}>
            <Box marginBottom={6}>
                <Heading>계정 관리</Heading>
            </Box>

            <ProfileFields
                id={id}
                setId={setId}
                password={password}
                setPassword={setPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                nickname={nickname}
                setNickname={setNickname}
                email={email}
                setEmail={setEmail}
                changePw={changePw}
                handelChangeButton={handelChangeButton}
                handleFieldBorder={handleFieldBorder}
                idFieldRef={idFieldRef}
                pwFieldRef={pwFieldRef}
                newPwFieldRef={newPwFieldRef}
                nicknameFieldRef={nicknameFieldRef}
                emailFieldRef={emailFieldRef}
            />

            <ActionButtons setIsSave={setIsSave} setIsDelete={setIsDelete}/>

            {isSave && (
                <ConfirmationModal
                    message="변경사항을 저장하시겠습니까?"
                    onConfirm={submitProfile}
                    onCancel={() => setIsSave(false)}
                />
            )}

            {isDelete && (
                <ConfirmationModal
                    message="정말로 회원 탈퇴하시겠습니까?"
                    onConfirm={deleteProfile}
                    onCancel={() => setIsDelete(false)}
                />
            )}
        </Box>
    );
}
