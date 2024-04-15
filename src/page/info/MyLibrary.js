import LoadingIndicator from "../../component/LoadingIndicator";
import {Box, Flex, Heading, Masonry, Sticky} from "gestalt";
import React, {useEffect, useRef, useState} from "react";
import GridComponent from "../../component/GridComponent";
import api from "../../api";

export default function MyLibrary() {
    const [pins, setPins] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [total, setTotal] = useState(100);
    const scrollContainerRef = useRef();
    const gridRef = useRef();

    const getPins = async (n) => {
        try {
            const response = await api.post("http://localhost:8080/pin/myPins", {
                amount: 4,
                offset: n.from
            })
            console.log(response.data);
            return Promise.resolve(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getPins({from: 0}).then((newPins) => {
            setPins(newPins);
        });

        const handleResize = () => {
            setWidth(window.innerWidth - 100);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);

        }
    }, []);

    return (
        <Box>
            <Box marginBottom={6} minHeight={"calc(100vh - 178px)"}>
                <Box width={width} maxWidth={"calc(100vw - 500px)"} ref={(el) => {
                    scrollContainerRef.current = el;
                }}>
                    {scrollContainerRef.current && (<Masonry
                        ref={(ref) => {
                            gridRef.current = ref;
                        }}
                        columnWidth={250}
                        gutterWidth={20}
                        items={pins}
                        layout="flexible"
                        minCols={1}
                        renderItem={({data}) => <GridComponent data={data}/>}
                        scrollContainer={() => scrollContainerRef.current}
                        loadItems={(n) => {

                            if (n.from === total) {
                                console.log('end of list');
                                return Promise.resolve(0);
                            }

                            return getPins(n).then((newPins) => {
                                console.log(newPins);
                                setPins([...pins, ...newPins]);
                            });
                        }}
                    />)}
                </Box>
            </Box>
        </Box>
    );
}