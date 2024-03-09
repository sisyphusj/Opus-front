import {useEffect, useId, useRef, useState} from 'react';
import {Box, Flex, Image, Label, Masonry, Text,} from 'gestalt';
import {pins} from './pins';
import GridComponent from './GridComponent';

function getPins(n) {
    const pinList = [...new Array(n)].map(() => [...pins]).flat();
    return Promise.resolve(pinList);
}

export default function Feed() {
    const [pins, setPins] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(false);
    const labelId = useId();

    function orderPins() {
        const newPins = [...pins, ...getPins(10)];
        return setPins(newPins);
    }


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
                            // console.log(n);
                            if(n.from === 100) return Promise.resolve(0);
                            return getPins(n).then((newPins) => {
                                setPins([...pins, ...newPins]);
                            });
                        }}

                    />
                </div>
            </Flex>
        </Box>
    );
}
