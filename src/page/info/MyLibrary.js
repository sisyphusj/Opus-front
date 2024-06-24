import { Box, Masonry } from "gestalt";
import React, { useEffect, useRef, useState, useCallback } from "react";
import GridComponent from "../../component/GridComponent";
import api from "../../api";
import { useRecoilValue } from "recoil";
import { isLoginState } from "../../atom";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../../hooks/useSnackbar";

export default function MyLibrary() {
  const [pins, setPins] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [total, setTotal] = useState(100); // 임의 설정한 총 핀 개수
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태
  const scrollContainerRef = useRef(null);
  const gridRef = useRef(null); // Masonry 컴포넌트의 레퍼런스
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // 핀 데이터를 가져오는 함수
  const getPins = async (offset) => {
    try {
      const response = await api.get(`/api/pins/my-pins?offset=${offset}&amount=4`);
      return response.data;
    } catch (error) {
      console.error(error);
      showSnackbar('error', '핀을 불러오는데 실패했습니다.');
      return [];
    }
  };

  // 초기 데이터 로드 및 화면 크기 변경 핸들러 설정
  useEffect(() => {
    if (!isLogin) {
      showSnackbar('warning', '로그인 후 이용해주세요.');
      return navigate('/');
    }

    const fetchInitialPins = async () => {
      const initialPins = await getPins(0);
      setPins(initialPins);
    };

    fetchInitialPins();

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLogin, navigate, showSnackbar]);

  // Masonry의 loadItems 함수를 통해 데이터를 추가로 불러오는 함수
  const loadMoreItems = useCallback(async ({ from }) => {
    if (hasMore && !loading) {
      setLoading(true);
      const newPins = await getPins(from);
      if (newPins.length > 0) {
        setPins((prevPins) => [...prevPins, ...newPins]);
        if (newPins.length < 4 || pins.length + newPins.length >= total) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }
  }, [hasMore, loading, pins.length, total]);

  // 반응형을 위한 컬럼 너비와 간격 설정
  const columnWidth = Math.max(150, Math.min(236, width / 5));
  const gutterWidth = width < 768 ? 5 : 10;

  return (
      <Box>
        <Box marginBottom={6} minHeight={"calc(100vh - 178px)"}>
          <Box
              minWidth={width < 768 ? "100%" : "584px"}
              maxWidth={"calc(100vw - 100px)"}
              ref={scrollContainerRef}
              overflow={"auto"} // 스크롤 가능하도록 설정
              height={`calc(100vh - 178px)`} // 헤더 높이만큼 빼서 맞춤
          >
            {scrollContainerRef.current && (
                <Masonry
                    ref={gridRef} // Masonry 컴포넌트의 레퍼런스 설정
                    columnWidth={columnWidth}
                    gutterWidth={gutterWidth}
                    items={pins}
                    layout="flexible"
                    minCols={1}
                    renderItem={({ data }) => <GridComponent data={data} />}
                    scrollContainer={() => scrollContainerRef.current}
                    loadItems={loadMoreItems} // 무한 스크롤을 위한 데이터 로드 함수 적용
                />
            )}
          </Box>
        </Box>
      </Box>
  );
}
