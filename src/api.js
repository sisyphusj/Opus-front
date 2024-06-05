import axios from "axios";
import {getCookieToken, setRefreshToken} from "./Cookies";

// Axios 인스턴스 생성
export const api = axios.create({
    baseURL: "http://localhost:8080",
});

// Axios 인터셉터 설정
api.interceptors.request.use(
    async (config) => {
        const accessToken = sessionStorage.getItem("accessToken");


        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // console.log(config);
        return config;
    },
    (error) => {
        // 예외 처리
        console.log(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {

        const originalConfig = error.config;

        console.log(error);

        if (error.response.status === 401) {
            const refreshToken = getCookieToken();
            const accessToken = sessionStorage.getItem("accessToken");

            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const response = await axios.post("http://localhost:8080/member/reissue", {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });

                if (response.data) {
                    const newAccessToken = response.data.accessToken;
                    setRefreshToken(response.data.refreshToken);
                    sessionStorage.setItem("accessToken", newAccessToken);
                    return api(originalConfig);
                }
            } catch (e) {
                console.log(e);
                alert("인증에 실패하였습니다 다시 로그인해 주십시오.");
                window.location.href = "/";
            }
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;
