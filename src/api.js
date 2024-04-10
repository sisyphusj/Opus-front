import axios from "axios";
import Cookie from "./Cookie";

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// Axios 인터셉터 설정
api.interceptors.request.use(
    async (config) => {
        // 쿠키 가져오기
        const sessionCookie = Cookie.getSessionCookie();

        // 쿠키가 존재한다면 헤더에 추가
        if (sessionCookie) {
            config.headers["Authorization"] = `Bearer ${sessionCookie}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // 응답에서 받은 쿠키 정보 확인
        const cookies = response.headers['set-cookie'];

        // 쿠키가 존재한다면 저장
        if (cookies) {
            const sessionCookie = cookies.find(cookie => cookie.startsWith('session='));
            if (sessionCookie) {
                const sessionId = sessionCookie.split('=')[1];
                Cookie.setSessionCookie(sessionId);
            }
        }

        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
