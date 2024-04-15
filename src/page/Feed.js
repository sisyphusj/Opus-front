import {useEffect, useId, useRef, useState} from 'react';
import {Box, Flex, Masonry,} from 'gestalt';
import GridComponent from '../component/GridComponent';
import api from "../api";

export default function Feed() {
    const [pins, setPins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(null);
    const labelId = useId();
    const scrollContainerRef = useRef();

    const getPins = async (n) => {
        try {
            await getTotalCount();
            const response = await api.post("http://localhost:8080/pin/list", {
                amount: 4,
                offset: offset
            })
            // console.log(response.data);
            setOffset(offset + 4);

            return Promise.resolve(response.data);
        } catch (error) {
            console.error(error);
        }

    }

    const getTotalCount = () => {
        try {
            const response = api.get("http://localhost:8080/pin/total");
            response.then((res) => {
                setTotal(res.data);
                // console.log(total);
            })

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getPins({from: 0}).then((newPins) => {
            setPins(newPins);
        });
    }, []);

    return (
        <Box marginTop={10} minHeight={"calc(100vh - 162px)"}
        ref={(e) => {scrollContainerRef.current = e;}}>
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
                    if (n.from === total) return Promise.resolve(0);
                    return getPins(n).then((newPins) => {
                        // console.log(newPins);
                        setPins([...pins, ...newPins]);
                    });
                }}
            />
            )}
        </Box>
    );
}
