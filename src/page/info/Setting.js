import {Box, Flex, Tabs, Text} from "gestalt";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import MyProfile from "./MyProfile";
import MyLibrary from "./MyLibrary";
import {Outlet, useNavigate} from "react-router-dom";


export default function Setting() {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const tabRef1 = useRef(null);
    const tabRef2 = useRef(null);

    useLayoutEffect(() => {
        tabRef1.current.querySelector('.tBJ').style.fontSize = "18px";
        tabRef2.current.querySelector('.tBJ').style.fontSize = "18px";

    }, []);

    const handleTabClick = (index) => {

        if (index === 0) {
            setActiveIndex(index);
            navigate("/settings/profile");
        } else if (index === 1) {
            setActiveIndex(index);
            navigate("/settings/library");
        }
    };

    return (
        <Box marginStart={7} marginEnd={7} maxWidth={1200}>
            <Flex wrap={true} height="calc(100vh - 122px)" justifyContent={"between"}>
                <Box width={100} marginEnd={7} height={150}>
                    <Tabs activeTabIndex={activeIndex}
                          onChange={({activeTabIndex}) => handleTabClick(activeTabIndex)} tabs={[
                        {text: 'profile', ref: tabRef1},
                        {text: 'my Library', ref: tabRef2},
                    ]}
                          wrap={true}
                    />
                </Box>
                <Box width={800} padding={4}>
                    <Outlet/>
                </Box>
            </Flex>
        </Box>
    );
}

