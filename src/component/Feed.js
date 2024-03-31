import {useEffect, useId, useState} from 'react';
import {Box, Flex, Masonry,} from 'gestalt';
import axios from "axios";
import GridComponent from './GridComponent';

// const getPins = (n) => {
//     const pinList = [...new Array(n)].map(() => [...pins]).flat();
//     return Promise.resolve(pinList);
// }

export default function Feed() {
    const [pins, setPins] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const labelId = useId();

    const getPins1 = async (n) => {

        console.log(Number(n));

        try {
            const response = await axios.post("http://localhost:8080/pin/list", {
                m_id: 1,
                amount: 5,
                offset: offset
            })

            console.log(response.data);

            return Promise.resolve(response.data);
        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWidth(width);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [])

    useEffect(() => {
        getPins1(10);
    }, []);

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
                            // console.log(n);
                            if (n.from === 100) return Promise.resolve(0);
                            return getPins1(n).then((newPins) => {
                                console.log(newPins);
                                setPins([...pins, ...newPins]);
                            });
                        }}

                    />
                </div>
            </Flex>
        </Box>
    );
}
