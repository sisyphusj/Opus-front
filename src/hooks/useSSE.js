import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentPinState, isLoginState } from '../atom';
import { EventSourcePolyfill } from 'event-source-polyfill';
import api from "../api";

const useSSE = () => {
    const pinData = useRecoilValue(currentPinState);
    const [likeCount, setLikeCount] = useState(-1);
    const isLogin = useRecoilValue(isLoginState);

    /**
     * 좋아요 개수를 불러오는 함수
     */
    const getCountLike = async () => {

        try {
            const response = await api.get(`/api/likes/pin/${pinData.pinId}`);
            setLikeCount(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (!pinData || !isLogin) return;

        getCountLike();

        const accessToken = sessionStorage.getItem('accessToken');
        let eventSource;

        // SSE 연결 설정 함수
        const connectSSE = (token) => {
            // 기존의 SSE 연결이 있다면 정리
            if (eventSource) {
                eventSource.close();
            }

            eventSource = new EventSourcePolyfill(
                `http://localhost:8080/api/like-subscribe/subscribe/${pinData.pinId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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
            };

            eventSource.onerror = async (event) => {
                console.error('SSE connection error:', event);

                // 오류 처리 - 상태 코드 확인
                const status = event.target.readyState === EventSource.CLOSED ? 500 : 401;

                if (status === 401) {
                    console.log('Token expired, fetching new token via getCountLike');
                    // 401 오류 시 `getCountLike` 호출하여 재발급 로직 활용
                    await getCountLike();
                } else if (status === 500) {
                    console.log('Server error, closing SSE connection and cleaning up');
                    // 500 서버 오류 처리: 모든 SSE 연결 종료
                    await cleanup();
                } else {
                    console.error('Unhandled error or maximum retry attempts reached');
                }
            };

            return eventSource;
        };

        // 초기 SSE 연결 설정
        eventSource = connectSSE(accessToken);

        // SSE 연결 해제 및 서버에 구독 해제 요청
        const cleanup = async () => {
            console.log('Cleaning up SSE connection');
            if (eventSource) {
                eventSource.close();
                eventSource = null;
            }
            try {
                const response = await api.delete(
                    `/api/like-subscribe/unsubscribe/${pinData.pinId}`
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
