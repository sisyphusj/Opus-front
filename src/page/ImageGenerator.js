import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Box, Button, ButtonGroup, ComboBox, Flex, Heading, Image, NumberField, SearchField, TextField} from "gestalt";
import {Input, Slider} from "@mui/material";
import axios from "axios";
import styled from "styled-components";

export default function ImageGenerator() {
    const apiKey = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const [loading, setLoading] = useState(undefined);
    const [url, setUrl] = useState("");
    const [searchValue, setSearchValue] = useState('');
    const [searchNegativeValue, setSearchNegativeValue] = useState('');
    const textFieldRef = useRef(null);
    const negativeTextFieldRef = useRef(null);
    const mainContainerRef = useRef(null);
    const seedFieldRef = useRef(null);
    const numberFieldRef = useRef(null);
    const [value, setValue] = useState(30);
    const [direction, setDirection] = useState('row');
    const [mainDirection, setMainDirection] = useState('row');
    const [customWidth, setCustomWidth] = useState(600);
    const [seed, setSeed] = useState(-1);
    const [samples, setSamples] = useState(1);
    const [openArray, setOpenArray] = useState([false, false, false, false]);
    const [imageSize, setImageSize] = useState([1024, 1024]);

    const saveImage = async () => {


        const data = await axios.post("http://localhost:8080/pin", {
            m_id: 1,
            image_path: url,
            tag : searchValue,
        });

        console.log(data);
    }

    function getImages() {
        alert("click");

        setLoading(true);

        const datas = {
            version: "v2.1",
            prompt: searchValue,
            negative_prompt: searchNegativeValue,
            width: imageSize[0],
            height: imageSize[1],
        }

        const data = axios.post("https://api.kakaobrain.com/v2/inference/karlo/t2i",
            JSON.stringify(datas)
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'KakaoAK ' + apiKey,
                },
            });

        const result = data.then((res) => {
            setLoading(false);
            console.log(res.data);
            return res.data;
        });

        try {
            data.then((res) => {
                setLoading(false);
                console.log(res.data.images[0].image);
                setUrl(res.data.images[0].image);
                return res.data;
            });
        } catch (e) {
            console.log(e);
        }

    }

    const handleFieldBorder = (ref, boolean) => {
        ref.current.style.boxShadow = "none";
        if (boolean) {
            ref.current.style.borderColor = "#F2709C";
        } else {
            ref.current.style.borderColor = "#cdcdcd";
        }
    }

    const handleButtonGroup = (n) => {
        setOpenArray(
            n === 1 ? [true, false, false, false] :
                n === 2 ? [false, true, false, false] : n === 3 ? [false, false, true, false] : [false, false, false, true]
        )
        setImageSize(n === 1 ? [1024, 1024] : n === 2 ? [1280, 768] : n === 3 ? [768, 1280] : [512, 512])
    }

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 100) {
            setValue(100);
        }
    };

    useLayoutEffect(() => {
        function updateDirection() {
            setDirection(window.innerWidth > 1350 ? 'row' : 'column');
            setCustomWidth(window.innerWidth > 730 ? 600 : 400);
            setMainDirection(window.innerWidth > imageSize[0] + 1200 ? 'row' : 'column');
        }

        window.addEventListener('resize', updateDirection);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => window.removeEventListener('resize', updateDirection);
    }, []);


    useEffect(() => {
        if (mainContainerRef.current) {
            mainContainerRef.current.style.minHeight = "calc(100vh - 122px)";
        }

        if (textFieldRef.current) {
            textFieldRef.current.style.borderRadius = "14px";
            negativeTextFieldRef.current.style.borderRadius = "14px";
        }

    }, []);

    useEffect(() => {
        // console.log(imageSize)

    }, [ imageSize]);

    return (
        <Flex direction={mainDirection}>
            <Box fit marginStart={8} marginEnd={8} padding={5} ref={mainContainerRef}>
                <Flex maxWidth={1500} minWidth={"100%"} direction="column" gap={5} flex={"grow"}>
                    <Box maxWidth={1070} margin={4}>
                        <Label>Prompt</Label>
                        <SearchField
                            accessibilityLabel={"search"}
                            id="prompt"
                            onChange={({value}) => setSearchValue(value)}
                            value={searchValue}
                            size="lg"
                            autoComplete={"off"}
                            ref={textFieldRef}
                            onFocus={() => handleFieldBorder(textFieldRef, true)}
                            onBlur={() => handleFieldBorder(textFieldRef, false)}
                        />
                    </Box>

                    <Box maxWidth={1070} marginStart={4} marginEnd={4}>
                        <Label>NegativePrompt</Label>
                        <SearchField
                            accessibilityLabel={"search"}
                            id="prompt"
                            onChange={({value}) => setSearchNegativeValue(value)}
                            value={searchNegativeValue}
                            size="lg"
                            autoComplete={"off"}
                            ref={negativeTextFieldRef}
                            onFocus={() => handleFieldBorder(negativeTextFieldRef, true)}
                            onBlur={() => handleFieldBorder(negativeTextFieldRef, false)}
                        />
                    </Box>

                    <Box fit margin={2}>
                        <Flex direction={direction} justifyContent={"between"}>
                            <Box>
                                <Box width={customWidth} margin={3} marginEnd={6}>
                                    <Label>Sampling Steps</Label>
                                    <Slider
                                        aria-label="SamplingSteps"
                                        defaultValue={50}
                                        valueLabelDisplay="auto"
                                        shiftStep={30}
                                        step={5}
                                        marks
                                        min={10}
                                        max={100}
                                        style={{color: "#FF9472", marginBottom: "30px"}}
                                    />

                                    <Label>Guidance Scale</Label>
                                    <Slider
                                        aria-label="GuidanceScale"
                                        defaultValue={5}
                                        valueLabelDisplay="auto"
                                        shiftStep={1}
                                        step={1}
                                        marks
                                        min={4}
                                        max={15}
                                        style={{color: "#FF9472"}}
                                    />
                                </Box>


                                <Box width={200} margin={3} marginTop={5} marginBottom={5}>
                                    <Label> Seed </Label>
                                    <TextField id={"seed"} onChange={(v) => setSeed(v)} autoComplete={"off"} size={"md"}
                                               placeholder={"random seed = -1"} ref={seedFieldRef}
                                               onFocus={() => handleFieldBorder(seedFieldRef, true)}
                                               onBlur={() => handleFieldBorder(seedFieldRef, false)}/>
                                </Box>

                                <Box width={100} margin={3} marginTop={5}>
                                    <Label>Samples</Label>
                                    <NumberField id={"samples"} onChange={(v) => setSamples(v)} autoComplete={"off"}
                                                 size={"md"} min={1} max={8} ref={numberFieldRef}
                                                 onFocus={() => handleFieldBorder(numberFieldRef, true)}
                                                 onBlur={() => handleFieldBorder(numberFieldRef, false)}/>
                                </Box>


                            </Box>

                            <Box width={"100%"} margin={3}>
                                <Box>
                                    <Label style={{marginBottom: "6px"}}>Size</Label>
                                    <ButtonGroup>
                                        <Button text={"1024×1024"} selected={openArray[0]} size={"lg"}
                                                onClick={() => handleButtonGroup(1)}/>
                                        <Button text={"1280×768"} selected={openArray[1]} size={"lg"}
                                                onClick={() => handleButtonGroup(2)}/>
                                        <Button text={"768×1280"} selected={openArray[2]} size={"lg"}
                                                onClick={() => handleButtonGroup(3)}/>
                                        <Button text={"512×512"} selected={openArray[3]} size={"lg"}
                                                onClick={() => handleButtonGroup(4)}/>
                                    </ButtonGroup>
                                </Box>

                            </Box>
                        </Flex>


                        <Box fit marginTop={12}>
                            <Flex justifyContent={"end"} alignItems="stretch">
                                <Box width={600}>
                                    {/*{loading ? <h1>로딩중</h1> : loading === false ? <h1>로딩 완료</h1> : null}*/}
                                    <Button fullWidth={true} text={"Create Image"} onClick={getImages} size={"lg"}/>
                                    <Button fullWidth={true} text={"Save"} onClick={saveImage} size={"lg"}/>
                                </Box>
                            </Flex>
                        </Box>


                    </Box>
                </Flex>
            </Box>

            <Box width={imageSize[0]} height={imageSize[1]} margin={10}>
                <Image alt={"picture"} naturalHeight={1024} naturalWidth={1024} fit={"cover"} src={url}/>
            </Box>

        </Flex>
    );
}

const Label = styled.h3`
    margin-left: 6px;
    margin-bottom: 4px;
    color: #F2709C;
`;