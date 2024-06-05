import {Box, Masonry} from "gestalt";
import React, {useEffect, useRef, useState} from "react";
import GridComponent from "../../component/GridComponent";
import api from "../../api";
import {useRecoilState, useRecoilValue} from "recoil";
import {isLoginState, snackMessageState, snackOpenState, snackTypeState} from "../../atom";
import {useNavigate} from "react-router-dom";

export default function MyLibrary() {
    const [pins, setPins] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [total, setTotal] = useState(100);
    const scrollContainerRef = useRef();
    const gridRef = useRef();
    const isLogin = useRecoilValue(isLoginState);
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useRecoilState(snackOpenState);
    const [snackbarMessage, setSnackbarMessage] = useRecoilState(snackMessageState);
    const [snackbarType, setSnackbarType] = useRecoilState(snackTypeState);

    const handleSnackBar = (type, msg) => {
        setSnackbarType(type);
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
    }

    const getPins = async (n) => {
        try {
            const response = await api.post("http://localhost:8080/pin/myPins", {
                amount: 4,
                offset: n.from
            })

            return Promise.resolve(response.data);
        } catch (error) {
            console.error(error);
            handleSnackBar('error', '핀을 불러오는데 실패했습니다.');
            return Promise.resolve([]);
        }
    }

    useEffect(() => {

        if (!isLogin) {
            handleSnackBar('warning', '로그인 후 이용해주세요.');
            return (navigate('/'));
        }

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
                                // console.log(newPins);
                                setPins([...pins, ...newPins]);
                            });
                        }}
                    />)}
                </Box>
            </Box>
        </Box>
    );
}