import React from 'react';
import { Box, Flex, Image } from 'gestalt';
import styled from 'styled-components';
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { ReactComponent as SigLogo } from "../../assets/sig_light.svg";
import { ReactComponent as DarkSigLogo } from "../../assets/sig_dark.svg";
import LoadingIndicator from "../../component/LoadingIndicator";
import { useRecoilValue } from "recoil";
import { isDarkModeState } from "../../atom";

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

export const ImageContainer = styled.img`
  width: 170px;

  &:hover {
    opacity: 0.7;
  }
`;

// 이미지를 표시하는 컴포넌트
const ImageDisplay = ({ loading, imgLoad, imageItem, currentImg, setCurrentImg }) => {
    const isDarkMode = useRecoilValue(isDarkModeState);

    return (
        <Flex justifyContent={"center"}>
            <Box margin={10} width={700} height={700} borderStyle={"shadow"}>
                {!loading && !imgLoad && (
                    <Flex direction={"column"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={700}>
                        <DefaultLogo/>
                        {isDarkMode ? <CustomDarkSig/> : <CustomSig/>}
                    </Flex>
                )}

                {loading && !imgLoad && (
                    <Flex justifyContent={"center"} alignItems={"center"} width={"100%"} height={700}>
                        <CustomLoadingIndicator/>
                    </Flex>
                )}

                {!loading && imgLoad && (
                    <Box height={700}>
                        <Image alt={"picture"} naturalHeight={300} naturalWidth={300} fit={"contain"} src={imageItem[currentImg].image} />
                    </Box>
                )}
            </Box>
        </Flex>
    );
};

export default ImageDisplay;
