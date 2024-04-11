import {useRef, useState} from 'react';
import {Box, Flex, IconButton, SearchField, Button} from 'gestalt';
import {ReactComponent as LightLogo} from "../assets/lightlogo.svg";
import {ReactComponent as DarkLogo} from "../assets/darklogo.svg";
import {NavLink, useNavigate} from "react-router-dom";
import {isDarkMode} from "../atom";
import {useRecoilState} from "recoil";
import LoginModal from "./LoginModal";
import api from "../api";

export default function Header() {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const SearchFieldRef = useRef(null);
    const [turnDarkMode, setTurnDarkMode] = useRecoilState(isDarkMode);

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
        if(turnDarkMode) {
            setTurnDarkMode(false);
        } else {
            setTurnDarkMode(true);
        }
    }

    const test = () => {
        try{
            const resp = api.get('/member/1');
            console.log(resp);

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Box
            padding={8}
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            // maxHeight={122}
        >
            <Flex alignItems="center" flex="grow" gap={{row: 4, column: 0}}>
                <NavLink to={"/"} style={{textDecoration: "none"}}>
                    {turnDarkMode ? <DarkLogo width="110" height="54"/> : <LightLogo width="110" height="54"/> }
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
                        onFocus={() => {handleTextFieldShadow(true)}} onBlur={() => {handleTextFieldShadow(false)}}
                        size="lg"
                        autoComplete={"off"}
                    />
                </Flex.Item>
                {/*<IconButton*/}
                {/*    accessibilityLabel="Notifications"*/}
                {/*    icon="speech-ellipsis"*/}
                {/*    size="md"*/}
                {/*/>*/}
                <LoginModal />
                <IconButton
                    accessibilityLabel="Dark Mode"
                    icon={turnDarkMode ? "sun" : "moon"}
                    size="lg"
                    onClick={() => handleDarkMode()} />
                <IconButton accessibilityLabel="Profile" icon="person" size="lg" onClick={() => test()}/>
            </Flex>
        </Box>
    );
}

