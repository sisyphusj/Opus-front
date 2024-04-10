import { useCookies } from 'react-cookie';

export default function Cookie () {
    const [cookies, setCookie, removeCookie] = useCookies(['session']);

// 쿠키 저장
     const setSessionCookie = (sessionId) => {
        setCookie('session', sessionId, { path: '/' });
    };

// 쿠키 조회
     const getSessionCookie = () => {
        return cookies.session;
    };

// 쿠키 삭제
    const removeSessionCookie = () => {
        removeCookie('session');
    };

    return {setSessionCookie, getSessionCookie, removeSessionCookie};
}

