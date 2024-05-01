import axios from "axios";
import Cookie from "./Cookie";

// Axios 인스턴스 생성
export const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': "http://localhost:8080",
    },
});

// Axios 인터셉터 설정
api.interceptors.request.use(
    async (config) => {
        // 쿠키 가져오기
        const sessionCookie = Cookie.getSessionCookie;

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
        // console.log(response);
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
