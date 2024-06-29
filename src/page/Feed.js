import { useEffect, useRef, useState } from 'react';
import { Masonry } from 'gestalt';
import GridComponent from '../component/GridComponent';
import api from "../api";
import { searchKeywordState } from "../atom";
import { useRecoilValue } from "recoil";
import useSnackbar from "../hooks/useSnackbar";
import { Box } from "@mui/material";

export default function Feed() {
    const [pins, setPins] = useState([]);
    const [total, setTotal] = useState(100); // 임의 설정한 총 핀 개수
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
    const [loading, setLoading] = useState(false); // 데이터 로딩 상태
    const scrollContainerRef = useRef();
    const keyword = useRecoilValue(searchKeywordState);
    const { showSnackbar } = useSnackbar();

    // 핀 데이터를 가져오는 함수
    const getPins = async (offset, keyword) => {
        try {
            const response = await api.get(
                `/api/pins?offset=${offset}&amount=4&keyword=${keyword || ''}`
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            showSnackbar('error', '핀을 불러오는데 실패했습니다.');
            return [];
        }
    };

    const getTotalCount = async () => {
        try {
            const response = await api.get(`/api/pins/total?keyword=${keyword || ''}`);
            return response.data;
        } catch (error) {
            console.error(error);
            showSnackbar('error', '핀을 불러오는데 실패했습니다.');
            return 0;
        }
    };

    // 키워드 변경 시 total을 업데이트하는 함수
    useEffect(() => {
        const fetchData = async () => {
            const count = await getTotalCount();
            setTotal(count);
            setPins([]); // 초기화
            setHasMore(true); // 추가 로딩 가능성 리셋
        };

        fetchData();
    }, [keyword]);

    // Masonry의 loadItems 함수를 통해 데이터를 추가로 불러오는 함수
    const loadMoreItems = async ({ from }) => {
        if (hasMore && !loading) {
            console.log('Loading more items...');
            setLoading(true);
            const newPins = await getPins(from, keyword);
            setPins((prevPins) => {
                const newUniquePins = newPins.filter(
                    newPin => !prevPins.some(pin => pin.pinId === newPin.pinId)
                );
                return [...prevPins, ...newUniquePins];
            });
            setHasMore(newPins.length === 4 && (from + newPins.length) < total);
            setLoading(false);
        }
    };

    return (
        <Box marginTop={"10px"} minHeight={"calc(100vh - 132px)"}
             height={`calc(100vh - 162px)`} // 헤더 높이만큼 빼서 맞춤
             style={{
                 overflowX: "hidden", overflowY: "auto",
             }}
             ref={scrollContainerRef}>
            {scrollContainerRef.current && (
                <Masonry
                    columnWidth={252}
                    gutterWidth={20}
                    items={pins}
                    layout="flexible"
                    minCols={1}
                    renderItem={({ data }) => <GridComponent data={data} />}
                    scrollContainer={() => scrollContainerRef.current}
                    loadItems={loadMoreItems} // 트리거 감지 및 데이터 로드 함수 적용
                />
            )}
        </Box>
    );
}
