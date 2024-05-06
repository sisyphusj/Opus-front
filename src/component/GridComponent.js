import {Box,  Flex, Image, Mask} from "gestalt";
import {useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";


export default function GridComponent({data}) {
    const [hover, setHover] = useState(false);
    const [clicked, setClicked] = useState(false);
    const navigate = useNavigate();

    const  handleHover = (bool) => {
        setHover(bool)
    }

    const handleClicked = (bool) => {
        setClicked(bool)
        alert("저장되었습니다.");
        navigate("/pin");
    }

    return (
        <Flex direction="column">
            <Mask rounding={4}>
                <Box tyle={{filter: "none"}} height="100%" onMouseOver={() => handleHover(true)}
                     onMouseOut={() => handleHover(false)}>
                     <Main $hover = {hover} onClick={() => handleClicked(true)}>
                        <Image
                            // alt={data.name}
                            // color={data.color}
                            naturalHeight={data.height ? data.height : 1024}
                            naturalWidth={data.width ? data.width : 1024}
                            src={data.imagePath}
                        >
                            <Box height="100%"  onMouseOver={() => handleHover(true)}
                                 onMouseOut={() => handleHover(false)}>
                            </Box>
                        </Image>
                    </Main>
                    {hover ? <CustomButton> 저장 </CustomButton> : null}
                </Box>
            </Mask>
        </Flex>
    );
}

const Main = styled.div`
    width: 100%;
    height: 100%;
    z-index: 1;
    filter: ${({ $hover }) => ($hover ? "brightness(0.7) saturate(0.9)" : "none")};
`;

const CustomButton = styled.button`
    width: 70px;
    height: 55px;
    top: 15px;
    right: 15px;
    z-index: 3;
    border-radius : 40px;
    border: none;
    background: linear-gradient(#f2709c, #ff9472);
    position: absolute;
    color: white;
    font-size: 18px;
    font-weight: bold;

    &:hover {
        filter: brightness(1) saturate(0.5);

    }
   
`;
