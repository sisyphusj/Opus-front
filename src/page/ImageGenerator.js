import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Box, Button, ButtonGroup, Column, Flex, Image, NumberField, SearchField, TextField} from "gestalt";
import {Slider} from "@mui/material";
import axios from "axios";
import styled from "styled-components";
import api from "../api";
import {ReactComponent as Logo} from "../assets/logo.svg";
import {ReactComponent as SigLogo} from "../assets/sig_light.svg";
import {ReactComponent as DarkSigLogo} from "../assets/sig_dark.svg";
import LoadingIndicator from "../component/LoadingIndicator";
import {useRecoilValue} from "recoil";
import {isDarkModeState, isLoginState} from "../atom";

export default function ImageGenerator() {
    const apiKey = process.env.REACT_APP_KAKAO_REST_API_KEY;

    const [loading, setLoading] = useState(false);
    const [imgLoad, setImgLoad] = useState(false);

    const isLogin = useRecoilValue(isLoginState);

    const [imageItem, setImageItem] = useState([]);
    const [currentImg, setCurrentImg] = useState(0);

    const [searchValue, setSearchValue] = useState('');
    const [searchNegativeValue, setSearchNegativeValue] = useState('');
    const textFieldRef = useRef(null);
    const negativeTextFieldRef = useRef(null);
    const mainContainerRef = useRef(null);
    const seedFieldRef = useRef(null);
    const numberFieldRef = useRef(null);
    const [direction, setDirection] = useState('row');
    const [mainDirection, setMainDirection] = useState('row');
    const [customWidth, setCustomWidth] = useState(600);

    const [seed, setSeed] = useState(-1);
    const [imgQuality, setImgQuality] = useState(50);
    const [guidanceScale, setGuidanceScale] = useState(5);

    const [samples, setSamples] = useState(1);
    const [openArray, setOpenArray] = useState([false, false, false, false]);
    const [imageSize, setImageSize] = useState([1024, 1024]);
    const isDarkMode = useRecoilValue(isDarkModeState);

    const saveImage = async () => {

        const data = await api.post("http://localhost:8080/pin", {
            imagePath: imageItem[currentImg].image,
            tag: searchValue,
            width: imageSize[0],
            height: imageSize[1],
            seed: imageItem[currentImg].seed,
            nTag: searchNegativeValue,
        });

        console.log(data);
    }

    function getImages() {
        alert("click");
        setImgLoad(false);
        setLoading(true);
        setCurrentImg(0);
        setImageItem([]);

        const settings = {
            version: "v2.1",
            prompt: searchValue,
            negative_prompt: searchNegativeValue,
            width: imageSize[0],
            height: imageSize[1],
            image_quality: imgQuality,
            guidance_scale: guidanceScale,
            samples: samples
        }

        const data = axios.post("https://api.kakaobrain.com/v2/inference/karlo/t2i",
            JSON.stringify(settings)
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'KakaoAK ' + apiKey,
                },
            });

        console.log(data);

        try {
            data.then((res) => {
                console.log(res.data.images[0].image);
                console.log(res.data);
                // res.data.images.forEach(image => {
                //     setUrl(image.image);
                // });
                setImageItem(res.data.images)
                setLoading(false);
                setImgLoad(true);
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

    useLayoutEffect(() => {
        function updateDirection() {
            setDirection(window.innerWidth > 1350 ? 'row' : 'column');
            setCustomWidth(window.innerWidth > 730 ? 600 : 400);
            setMainDirection(window.innerWidth > 1910 ? 'row' : 'column');
        }

        updateDirection();

        window.addEventListener('resize', updateDirection);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => window.removeEventListener('resize', updateDirection);
    }, []);


    useEffect(() => {

        if (mainContainerRef.current) {
            mainContainerRef.current.style.minHeight = "calc(100vh - 162px)";
        }

        if (textFieldRef.current) {
            textFieldRef.current.style.borderRadius = "14px";
            negativeTextFieldRef.current.style.borderRadius = "14px";
        }

    }, []);

    return (
        <Flex direction={mainDirection} justifyContent={"center"}>
            <Box maxWidth={1000} marginStart={8} padding={5} ref={mainContainerRef}>
                <Flex minWidth={"100%"} direction="column" gap={5} flex={"grow"}>
                    <Box margin={4}>
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

                    <Box marginStart={4} marginEnd={4}>
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
                                        onChange={(e) => setImgQuality(e.target.value)}
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
                                        onChange={(e) => setGuidanceScale(e.target.value)}
                                        style={{color: "#FF9472"}}

                                    />
                                </Box>

                                <Flex>
                                    <Box width={200} margin={3} marginTop={5}>
                                        <Label> Seed </Label>
                                        <TextField id={"seed"} onChange={(v) => setSeed(v.value)} autoComplete={"off"}
                                                   size={"md"}
                                                   value={seed}
                                                   placeholder={"random seed = -1"} ref={seedFieldRef}
                                                   onFocus={() => handleFieldBorder(seedFieldRef, true)}
                                                   onBlur={() => handleFieldBorder(seedFieldRef, false)}/>
                                    </Box>

                                    <Box width={100} margin={3} marginTop={5}>
                                        <Label>Samples</Label>
                                        <NumberField id={"samples"} onChange={(v) => setSamples(v.value)}
                                                     autoComplete={"off"}
                                                     size={"md"} min={1} max={4} ref={numberFieldRef}
                                                     value={samples}
                                                     onFocus={() => handleFieldBorder(numberFieldRef, true)}
                                                     onBlur={() => handleFieldBorder(numberFieldRef, false)}/>
                                    </Box>
                                </Flex>

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

                                <Box fit marginTop={7}>
                                    <Flex justifyContent={"start"} alignItems="stretch">
                                        <Box width={200}>
                                            <Button fullWidth={true} text={"Create Image"} onClick={getImages}
                                                    size={"lg"}/>
                                            {!loading && imgLoad && isLogin &&
                                                <Box marginTop={3}>
                                                    <Button fullWidth={true} text={"Save"} onClick={saveImage}
                                                            size={"lg"}/>
                                                </Box>}
                                        </Box>
                                    </Flex>
                                </Box>

                            </Box>
                        </Flex>
                    </Box>
                    <Box height={"100%"} minHeight={170} borderStyle={"lg"} padding={2}>
                        <Flex direction={"row"} justifyContent={"center"} alignItems={"center"}>
                            {imageItem.map((imageItem, index) => (
                                <Box key={imageItem.id} marginEnd={4} onMouseDown={() => setCurrentImg(index)}>
                                    <ImageContainer src={imageItem.image} alt={imageItem.seed}
                                                    style={{width: "170px"}}/>
                                </Box>
                            ))
                            }
                        </Flex>
                    </Box>

                </Flex>
            </Box>
            <Flex justifyContent={"center"}>
                <Box margin={10} width={700} height={700} borderStyle={"shadow"}>
                    {!loading && !imgLoad &&
                        <Flex direction={"column"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={700}>
                            <DefaultLogo/>
                            {isDarkMode ? <CustomDarkSig/> : <CustomSig/>}
                        </Flex>}

                    {loading && !imgLoad &&
                        <Flex justifyContent={"center"} alignItems={"center"} width={"100%"} height={700}>
                            <CustomLoadingIndicator/>
                        </Flex>}

                    {!loading && imgLoad &&
                        <Box height={700}>
                            <Image alt={"picture"} naturalHeight={300} naturalWidth={300} fit={"contain"}
                                   src={imageItem[currentImg].image}/>
                        </Box>
                    }
                </Box>
            </Flex>


        </Flex>
    );
}

const Label = styled.h3`
    margin-left: 6px;
    margin-bottom: 4px;
    color: #F2709C;
`;

const DefaultLogo = styled(Logo)`
    width: 200px;
    height: 200px;
    opacity: 0.8;
`;

const CustomSig = styled(SigLogo)`
    width: 200px;
    height: 70px;
`;

const CustomDarkSig = styled(DarkSigLogo)`
    width: 200px;
    height: 70px;
`;

const CustomLoadingIndicator = styled(LoadingIndicator)`
    width: 200px;
    height: 200px;
`;

const ImageContainer = styled.img`
    width: 170px;

    &:hover {
        opacity: 0.7;
    }

`;