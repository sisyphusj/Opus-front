import {useEffect, useId, useRef, useState} from 'react';
import {Box, Masonry,} from 'gestalt';
import GridComponent from '../component/GridComponent';
import api from "../api";
import {searchKeywordState} from "../atom";
import {useRecoilValue} from "recoil";

export default function Feed() {
    const [pins, setPins] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(null);
    // const labelId = useId();
    const scrollContainerRef = useRef();
    const keyword = useRecoilValue(searchKeywordState);

    const getPins = async (n, keyword) => {

        try {
            const response = await api.post("http://localhost:8080/pin/list", {
                amount: 4,
                offset: n.from,
                keyword: keyword
            })
            return Promise.resolve(response.data);
        } catch (error) {
            console.error(error);
        }

    }

    const getTotalCount = async (keyword) => {
        try {
            if(keyword === null) keyword = '';
            const response = await api.get(`/pin/total?keyword=${keyword}`);
            console.log(response.data);
            setTotal(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log("keyword 변경 : ",pins)
            setPins([]);
            await getTotalCount(keyword);
            try {
                const newPins = await getPins({from: 0}, keyword || ''); // keyword가 없을 경우 빈 문자열로 전달
                setPins(newPins);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [keyword]);

    return (
        <Box marginTop={10} minHeight={"calc(100vh - 162px)"} overflow={"hidden"}
             // ref={(e) => {
             //     scrollContainerRef.current = e;
             // }}
            /**
            * 스크롤 컨테이너 지정 관련 수정 필요
            */
        ref={scrollContainerRef}

        >
            {scrollContainerRef.current && (
                <Masonry
                    columnWidth={252}
                    gutterWidth={20}
                    items={pins}
                    layout="flexible"
                    minCols={1}
                    renderItem={({data}) => <GridComponent data={data}/>}
                    scrollContainer={() => scrollContainerRef.current}
                    loadItems={(n) => {
                        if (n.from === total) {
                            console.log("더 이상 로드할 데이터가 없습니다.");
                            return Promise.resolve(0);
                        }
                        return getPins(n, keyword).then((newPins) => {
                            setPins([...pins, ...newPins]);
                        });
                    }}
                />
            )}
        </Box>
    );
}
