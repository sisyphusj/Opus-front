import axios from "axios";
import {getCookieToken, setRefreshToken} from "./Cookies";

// Axios 인스턴스 생성
export const api = axios.create({
    baseURL: "http://localhost:8080",
});

const refreshInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

// Axios 인터셉터 설정
api.interceptors.request.use(
    async (config) => {
        const accessToken = sessionStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if (error.response && error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true; // 재시도 여부 플래그 설정

            const refreshToken = getCookieToken();
            const accessToken = sessionStorage.getItem("accessToken");

            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {

                const response = await refreshInstance.post(
                    "/api/auth/reissue-token",
                    {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json' // 기본 헤더만 포함
                        }
                    }
                );

                if (response.data) {

                    const newAccessToken = response.data.accessToken;
                    setRefreshToken(response.data.refreshToken);
                    sessionStorage.setItem("accessToken", newAccessToken);

                    console.log("토큰 재발급 성공");

                    // 새로운 accessToken으로 재시도
                    originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;

                    return api(originalConfig);
                }
            } catch (e) {
                console.log(e);
                alert("인증에 실패하였습니다 다시 로그인해 주십시오.");
                //TODO 로그아웃 처리
                window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
