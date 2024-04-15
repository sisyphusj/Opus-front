import {useRef, useState} from 'react';
import {Box, Flex, IconButton, SearchField, Button, Sticky, FixedZIndex} from 'gestalt';
import {ReactComponent as LightLogo} from "../assets/lightlogo.svg";
import {ReactComponent as DarkLogo} from "../assets/darklogo.svg";
import {NavLink, useNavigate} from "react-router-dom";
import {isDarkMode, isLoginState} from "../atom";
import {useRecoilState, useRecoilValue} from "recoil";
import LoginModal from "./LoginModal";

export default function Header() {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const SearchFieldRef = useRef(null);
    const [turnDarkMode, setTurnDarkMode] = useRecoilState(isDarkMode);
    const isLogin = useRecoilValue(isLoginState);
    const customZIndex = new FixedZIndex(999);

    function handleEditButton() {
        navigate("/image-generator");
    }

    const handleTextFieldShadow = (boolean) => {
        SearchFieldRef.current.style.boxShadow = "none";
        if (boolean) {
            SearchFieldRef.current.style.border = "2px solid #F2709C";
        } else {
            SearchFieldRef.current.style.border = "2px solid #cdcdcd";
        }
    }

    const handleDarkMode = () => {
        if (turnDarkMode) {
            setTurnDarkMode(false);
        } else {
            setTurnDarkMode(true);
        }
    }

    const handleInfoButton = () => {
        if (isLogin)
            navigate("/settings/profile");
        else {
            console.log("로그인이 필요합니다.");
        }
    }

    return (
        <Sticky top = {0} zIndex={customZIndex}>
            <Box
                padding={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color= {turnDarkMode ? "dark" : "light"}
                borderStyle={"shadow"}
            >
                <Flex alignItems="center" flex="grow" gap={{row: 4, column: 0}}>
                    <NavLink to={"/"} style={{textDecoration: "none"}}>
                        {turnDarkMode ? <DarkLogo width="110" height="54"/> : <LightLogo width="110" height="54"/>}
                    </NavLink>
                    <Button text={"만들기"} color={"gray"} size={"lg"} onClick={() => handleEditButton()}></Button>
                    <Flex.Item flex="grow">
                        <SearchField
                            accessibilityLabel={"search"}
                            id="headerSearchField"
                            onChange={({value}) => setSearchValue(value)}
                            placeholder="검색"
                            value={searchValue}
                            ref={SearchFieldRef}
                            onFocus={() => {
                                handleTextFieldShadow(true)
                            }} onBlur={() => {
                            handleTextFieldShadow(false)
                        }}
                            size="lg"
                            autoComplete={"off"}
                        />
                    </Flex.Item>
                    {/*<IconButton*/}
                    {/*    accessibilityLabel="Notifications"*/}
                    {/*    icon="speech-ellipsis"*/}
                    {/*    size="md"*/}
                    {/*/>*/}
                    <LoginModal/>
                    <IconButton
                        accessibilityLabel="Dark Mode"
                        icon={turnDarkMode ? "sun" : "moon"}
                        size="lg"
                        onClick={() => handleDarkMode()}/>
                    <IconButton accessibilityLabel="Profile" icon="person" size="lg"
                                onClick={() => handleInfoButton()}/>
                </Flex>
            </Box>
        </Sticky>
    );
}