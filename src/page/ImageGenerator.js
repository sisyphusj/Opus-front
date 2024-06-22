import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useCallback
} from "react";
import {Box, Flex} from "gestalt";
import axios from "axios";
import api from "../api";
import {useRecoilValue} from "recoil";
import {isLoginState} from "../atom";
import {useNavigate} from "react-router-dom";
import PromptField from "../component/img-generator/PromptField";
import ImageControls from "../component/img-generator/ImageControls";
import ImageDisplay, {
    ImageContainer
} from "../component/img-generator/ImageDisplay";
import useSnackbar from "../hooks/useSnackbar";

// 메인 컴포넌트
export default function ImageGenerator() {
    const apiKey = process.env.REACT_APP_KAKAO_REST_API_KEY;

    // 상태 변수
    const [loading, setLoading] = useState(false);
    const [imgLoad, setImgLoad] = useState(false);
    const [imageItem, setImageItem] = useState([]);
    const [currentImg, setCurrentImg] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [searchNegativeValue, setSearchNegativeValue] = useState('');
    const [direction, setDirection] = useState('row');
    const [mainDirection, setMainDirection] = useState('row');
    const [customWidth, setCustomWidth] = useState(600);
    const [seed, setSeed] = useState(-1);
    const [imgQuality, setImgQuality] = useState(50);
    const [guidanceScale, setGuidanceScale] = useState(5);
    const [samples, setSamples] = useState(1);
    const [openArray, setOpenArray] = useState([false, false, false, false]);
    const [imageSize, setImageSize] = useState([1024, 1024]);

    // Recoil 상태
    const isLogin = useRecoilValue(isLoginState);

    // 참조 변수
    const textFieldRef = useRef(null);
    const negativeTextFieldRef = useRef(null);
    const mainContainerRef = useRef(null);
    const seedFieldRef = useRef(null);
    const numberFieldRef = useRef(null);

    const navigate = useNavigate();

    const {showSnackbar} = useSnackbar();

    // 이미지 저장 함수
    const saveImage = async () => {
        try {
            const data = await api.post("/api/pins/register", {
                imagePath: imageItem[currentImg].image,
                prompt: searchValue,
                width: imageSize[0],
                height: imageSize[1],
                seed: imageItem[currentImg].seed,
                negativePrompt: searchNegativeValue,
            });

            console.log(data);
            showSnackbar('success', '이미지가 저장되었습니다.');

        } catch (e) {
            console.log(e);
            showSnackbar('error', '이미지를 저장하는데 실패했습니다.');
        }
    };

    // 이미지 생성 함수
    const getImages = async () => {
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
            samples: samples,
            seed : Array.from({ length: samples }, () => Number(seed))
        };

        try {
            const data = await axios.post(
                "https://api.kakaobrain.com/v2/inference/karlo/t2i",
                JSON.stringify(settings),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'KakaoAK ' + apiKey,
                    },
                });

            console.log(data);

            setImageItem(data.data.images);
            setLoading(false);
            setImgLoad(true);

            showSnackbar('success',
                '이미지 생성이 완료되었습니다. CDN 유효 시간이 지나기 전에 저장해주세요');

        } catch (e) {
            console.log(e);
            showSnackbar('error', '이미지 생성에 실패했습니다.');
        }
    };

    // 필드 테두리 처리
    const handleFieldBorder = useCallback((ref, active) => {
        ref.current.style.boxShadow = "none";
        ref.current.style.borderColor = active ? "#F2709C" : "#cdcdcd";
    }, []);

    // 버튼 그룹 핸들링
    const handleButtonGroup = (index) => {
        setOpenArray(openArray.map((_, i) => i === index));
        const sizes = [[1024, 1024], [1280, 768], [768, 1280], [512, 512]];
        setImageSize(sizes[index]);
    };

    // 레이아웃 효과
    useLayoutEffect(() => {
        const updateDirection = () => {
            setDirection(window.innerWidth > 1350 ? 'row' : 'column');
            setCustomWidth(window.innerWidth > 730 ? 600 : 400);
            setMainDirection(window.innerWidth > 1910 ? 'row' : 'column');
        };

        updateDirection();
        window.addEventListener('resize', updateDirection);

        return () => window.removeEventListener('resize', updateDirection);
    }, []);

    // 기본 효과
    useEffect(() => {
        if (!isLogin) {
            showSnackbar('warning', '로그인 후 이용해주세요.');
            navigate('/');
        }

        if (mainContainerRef.current) {
            mainContainerRef.current.style.minHeight = "calc(100vh - 122px)";
        }

        if (textFieldRef.current) {
            textFieldRef.current.style.borderRadius = "14px";
            negativeTextFieldRef.current.style.borderRadius = "14px";
        }
    }, [isLogin, showSnackbar, navigate]);

    return (
        <Flex direction={mainDirection} justifyContent={"center"}>
            <Box maxWidth={1000} marginStart={8} padding={5}
                 ref={mainContainerRef}>
                <Flex minWidth={"100%"} direction="column" gap={5}
                      flex={"grow"}>
                    <PromptField
                        label="Prompt"
                        value={searchValue}
                        onChange={setSearchValue}
                        ref={textFieldRef}
                        handleFieldBorder={handleFieldBorder}
                    />
                    <PromptField
                        label="NegativePrompt"
                        value={searchNegativeValue}
                        onChange={setSearchNegativeValue}
                        ref={negativeTextFieldRef}
                        handleFieldBorder={handleFieldBorder}
                    />
                    <ImageControls
                        direction={direction}
                        customWidth={customWidth}
                        setImgQuality={setImgQuality}
                        setGuidanceScale={setGuidanceScale}
                        seed={seed}
                        setSeed={setSeed}
                        samples={samples}
                        setSamples={setSamples}
                        openArray={openArray}
                        handleButtonGroup={handleButtonGroup}
                        handleFieldBorder={handleFieldBorder}
                        getImages={getImages}
                        saveImage={saveImage}
                        loading={loading}
                        imgLoad={imgLoad}
                        isLogin={isLogin}
                        seedFieldRef={seedFieldRef}
                        numberFieldRef={numberFieldRef}
                    />
                    <Box height={"100%"} minHeight={170} borderStyle={"lg"}
                         padding={2}>
                        <Flex direction={"row"} justifyContent={"center"}
                              alignItems={"center"}>
                            {imageItem.map((item, index) => (
                                <Box key={item.id} marginEnd={4}
                                     onMouseDown={() => setCurrentImg(index)}>
                                    <ImageContainer src={item.image}
                                                    alt={item.seed}/>
                                </Box>
                            ))}
                        </Flex>
                    </Box>
                </Flex>
            </Box>
            <ImageDisplay
                loading={loading}
                imgLoad={imgLoad}
                imageItem={imageItem}
                currentImg={currentImg}
                setCurrentImg={setCurrentImg}
            />
        </Flex>
    );
}
