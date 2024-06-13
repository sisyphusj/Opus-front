import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Box,
    Flex,
    Button,
    Sticky,
    FixedZIndex
} from 'gestalt';
import {useNavigate} from "react-router-dom";
import {
    isDarkModeState,
    isLoginState,
    searchKeywordState,
} from "../../atom";
import {useRecoilState} from "recoil";
import LoginModal from "../LoginModal";
import useSnackbar from "../../hooks/useSnackbar";
import Logo from "./Logo";
import SearchInput from "./SearchInput";
import HeaderIconButton from "./HeaderIconButton";

function Header() {
    const [searchValue, setSearchValue] = useState('');
    const [turnDarkMode, setTurnDarkMode] = useRecoilState(isDarkModeState);
    const [isLogin,] = useRecoilState(isLoginState);
    const [, setKeyword] = useRecoilState(searchKeywordState);

    const navigate = useNavigate();
    const customZIndex = new FixedZIndex(999);
    const SearchFieldRef = useRef(null);
    const {showSnackbar} = useSnackbar();

    /**
     * 버튼 클릭 시 ImageGenerator 페이지로 이동
     */
    const handleEditImageButton = useCallback(() => {
        if (isLogin) {
            navigate("/image-generator");
        } else {
            showSnackbar('warning', '로그인 후 이용해주세요.');
        }
    }, [isLogin, navigate, showSnackbar]);

    /**
     * 검색창의 Shadow를 조절하는 함수
     * @param boolean
     */
    const handleTextFieldShadow = useCallback((boolean) => {
        if (SearchFieldRef.current) {
            SearchFieldRef.current.style.boxShadow = "none";
            SearchFieldRef.current.style.border = boolean ? "2px solid #F2709C"
                : "2px solid #cdcdcd";
        }
    }, []);

    /**
     * 다크모드를 토글하는 함수
     * @type {(function(): void)|*}
     */
    const handleDarkMode = useCallback(() => {
        setTurnDarkMode((prevMode) => !prevMode);
    }, [setTurnDarkMode]);

    /**
     * 프로필 페이지로 이동하는 함수
     * @type {(function(): void)|*}
     */
    const handleInfoButton = useCallback(() => {
        if (isLogin) {
            navigate("/settings/profile");
        } else {
            showSnackbar('warning', '로그인 후 이용해주세요.');
        }
    }, [isLogin, navigate, showSnackbar]);

    /**
     * 검색어를 검색하는 함수
     * @type {(function(*): void)|*}
     */
    const handleOnKeyDown = useCallback((key) => {
        if (key === 'Enter') {
            setKeyword(searchValue);
        }
    }, [searchValue, setKeyword]);

    /**
     * 로고 클릭 시 Feed 으로 이동
     * @type {(function(): void)|*}
     */
    const handleLogoOnClick = useCallback(() => {
        setKeyword(null);
        navigate("/");
        window.location.reload();
    }, [navigate, setKeyword]);

    useEffect(() => {
        setKeyword(null);
    }, []);

    return (
        <Sticky top={0} zIndex={customZIndex}>
            <Box
                padding={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={turnDarkMode ? "dark" : "light"}
                borderStyle={"shadow"}
            >
                <Flex alignItems="center" flex="grow" gap={{row: 4, column: 0}}>
                    <Logo isDarkMode={turnDarkMode}
                          onClick={handleLogoOnClick}/>
                    <Button text={"만들기"} color={"gray"} size={"lg"}
                            onClick={() => handleEditImageButton()}></Button>
                    <Flex.Item flex="grow">
                        <SearchInput
                            value={searchValue}
                            onChange={({value}) => setSearchValue(value)}
                            onKeyDown={(e) => handleOnKeyDown(e.event.key)}
                            onFocus={() => handleTextFieldShadow(true)}
                            onBlur={() => handleTextFieldShadow(false)}
                            ref={SearchFieldRef}
                        />
                    </Flex.Item>
                    <LoginModal/>
                    <HeaderIconButton
                        icon={turnDarkMode ? "sun" : "moon"}
                        accessibilityLabel="Dark Mode"
                        onClick={handleDarkMode}
                    />
                    <HeaderIconButton
                        icon="person"
                        accessibilityLabel="Profile"
                        onClick={handleInfoButton}
                    />
                </Flex>
            </Box>
        </Sticky>
    );
}

// React.memo를 사용하여 props가 변경되지 않으면 리렌더링을 방지
export default React.memo(Header);