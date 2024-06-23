import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentPinState, isLoginState } from '../atom';
import axios from 'axios';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getCookieToken } from '../Cookies';

const useSSE = () => {
    const pinData = useRecoilValue(currentPinState);
    const [likeCount, setLikeCount] = useState(0);
    const isLogin = useRecoilValue(isLoginState);
    const [retryCount, setRetryCount] = useState(0); // 재시도 카운터 추가

    useEffect(() => {
        if (!pinData || !isLogin) return;

        const accessToken = sessionStorage.getItem('accessToken');

        // SSE 연결 설정 함수
        const connectSSE = (token) => {
            const eventSource = new EventSourcePolyfill(
                `http://localhost:8080/api/like-subscribe/subscribe/${pinData.pinId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            eventSource.onmessage = (event) => {
                try {
                    if (event.data === "ping") {
                        console.log('Ping message received:', event.data);
                    } else {
                        const data = JSON.parse(event.data);
                        if (data.likeCount !== undefined) {
                            setLikeCount(data.likeCount);
                        } else {
                            console.log('Received non-likeCount message:', data);
                        }
                    }
                } catch (error) {
                    console.error('Error parsing SSE message:', error);
                    console.error('Failed message data:', event.data);
                }
            };

            eventSource.addEventListener('like-update', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.likeCount !== undefined) {
                        setLikeCount(data.likeCount);
                    }
                } catch (error) {
                    console.error('Error parsing like-update message:', error);
                }
            });

            eventSource.onopen = () => {
                console.log('SSE connection opened');
                setRetryCount(0); // 성공적으로 연결되면 재시도 카운터 초기화
            };

            eventSource.onerror = async (event) => {
                console.error('SSE connection error:', event);
                eventSource.close();

                // JWT 토큰 재발급 로직
                if (retryCount < 2 || event.status === 401) {
                    try {
                        const response = await axios.post(
                            'http://localhost:8080/api/auth/reissue-token',
                            {
                                accessToken: token,
                                refreshToken: getCookieToken(),
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        );

                        if (response.status === 200) {
                            const newToken = response.data.accessToken;
                            sessionStorage.setItem('accessToken', newToken);
                            setRetryCount(0); // 새로운 토큰으로 재연결되면 카운터 초기화
                            connectSSE(newToken); // 새로운 토큰으로 재연결
                            console.log('Token refreshed successfully');
                        } else {
                            setRetryCount(retryCount + 1); // 재발급 실패 시 재시도 카운터 증가
                        }
                    } catch (error) {
                        setRetryCount(retryCount + 1);
                        console.error('Error refreshing token:', error);
                    }
                } else {
                    console.error('Maximum retry attempts reached or not a 401 error');
                    if (eventSource) {
                        eventSource.close();
                    }
                }
            };

            return eventSource;
        };

        // 초기 SSE 연결 설정
        const eventSource = connectSSE(accessToken);

        // SSE 연결 해제 및 서버에 구독 해제 요청
        const cleanup = async () => {
            console.log('Cleaning up SSE connection');
            if (eventSource) {
                eventSource.close();
            }
            try {
                const response = await axios.delete(
                    `http://localhost:8080/api/like-subscribe/unsubscribe/${pinData.pinId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                if (response.status === 200) {
                    console.log('Unsubscribed from SSE');
                }
            } catch (error) {
                console.error('Failed to unsubscribe from SSE', error);
            }
        };

        // 컴포넌트 언마운트 또는 pinData 변경 시 정리 작업 수행
        return () => {
            cleanup();
        };
    }, [pinData, isLogin]); // 의존성 배열에 pinData 및 isLogin 추가

    return { likeCount };
};

export default useSSE;
