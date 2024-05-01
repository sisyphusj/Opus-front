import {CustomLogo, CustomTextLogo} from "./CommonModal";
import {useEffect, useState} from "react";
import {Box, Flex, Mask} from "gestalt";

export default function PinModal() {
    useEffect(() => {
        console.log("음냐링");
    }, [])

    return (
        <Flex justifyContent={"center"}>
            <Box margin={12} width={800}>
                <Mask rounding={8} wash>
                    <Box borderStyle={"shadow"} height={500}>
                        <CustomLogo/>
                        <CustomTextLogo/>
                        <div>
                            <p>핀번호를 입력해주세요.</p>
                        </div>
                    </Box>
                </Mask>
            </Box>
        </Flex>
    )
}