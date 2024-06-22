import {Box, FixedZIndex, Flex, Sticky, Tabs} from "gestalt";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {isLoginState} from "../../atom";
import {useRecoilValue} from "recoil";
import useSnackbar from "../../hooks/useSnackbar";

export default function Setting() {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const tabRef1 = useRef(null);
    const tabRef2 = useRef(null);
    const tabRef3 = useRef(null);
    const customZIndex = new FixedZIndex(1);
    const isLogin = useRecoilValue(isLoginState);
    const {showSnackbar} = useSnackbar();

    useLayoutEffect(() => {
        tabRef1.current.querySelector('.tBJ').style.fontSize = "18px";
        tabRef2.current.querySelector('.tBJ').style.fontSize = "18px";
        tabRef3.current.querySelector('.tBJ').style.fontSize = "18px";

    }, []);

    const handleTabClick = (index) => {

        if (index === 0) {
            setActiveIndex(index);
            navigate("/settings/profile");
        } else if (index === 1) {
            setActiveIndex(index);
            navigate("/settings/library");
        } else if (index === 2) {
            setActiveIndex(index);
            navigate("/settings/comment");
        }
    };

    useEffect(() => {

        if (!isLogin) {
            showSnackbar('warning', '로그인 후 이용해주세요.');
            return (navigate('/'));
        }

        if (window.location.pathname === "/settings/profile") {
            setActiveIndex(0);
        } else if (window.location.pathname === "/settings/library") {
            setActiveIndex(1);
        } else if (window.location.pathname === "/settings/comment") {
            setActiveIndex(2);
        }
    }, []);

    return (
        <Box marginStart={7} marginEnd={7} maxWidth={1200}>
            <Flex justifyContent={"between"}>
                <Box zIndex={customZIndex}>
                    <Sticky top={122}>
                        <Box width={100} marginEnd={7} height={150}>
                            <Tabs activeTabIndex={activeIndex}
                                  onChange={({activeTabIndex}) => handleTabClick(
                                      activeTabIndex)} tabs={[
                                {text: 'profile', ref: tabRef1},
                                {text: 'my Library', ref: tabRef2},
                                {text: 'my Comment', ref: tabRef3}
                            ]}
                                  wrap={true}
                            />
                        </Box>
                    </Sticky>
                </Box>
                <Box width={800} padding={4}>
                    <Outlet/>
                </Box>
            </Flex>
        </Box>
    );
}

