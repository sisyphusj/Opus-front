import {useEffect, useId, useState} from 'react';
import {Box, Flex, Masonry,} from 'gestalt';
import axios from "axios";
import GridComponent from './GridComponent';

export default function Feed() {
    const [pins, setPins] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(null);
    const labelId = useId();

    const getPins = async (n) => {
        try {
            await getTotalCount();
            const response = await axios.post("http://localhost:8080/pin/list", {
                m_id: 1,
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
            const response = axios.get("http://localhost:8080/pin/total");
            response.then((res) => {
                setTotal(res.data);
                // console.log(total);
            })

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWidth(width);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [])

    return (
        <Box padding={2}>
            <Flex direction="column" gap={4}>
                <div
                    // tabIndex={0}
                    // ref={(el) => {
                    //     scrollContainerRef.current = el;
                    // }}
                    style={{
                        height: '100%',
                        margin: '0 auto',
                        width: `${width}px`,
                    }}
                >
                    <Masonry
                        columnWidth={252}
                        gutterWidth={20}
                        items={pins}
                        layout="basicCentered"
                        minCols={1}
                        renderItem={({data}) => <GridComponent data={data}/>}
                        scrollContainer={() => window}
                        loadItems={(n) => {
                            if (n.from === total) return Promise.resolve(0);
                            return getPins(n).then((newPins) => {
                                // console.log(newPins);
                                setPins([...pins, ...newPins]);
                            });
                        }}
                    />
                </div>
            </Flex>
        </Box>
    );
}
