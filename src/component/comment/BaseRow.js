// src/components/BaseRow.js
import React, { useState, useEffect, Fragment } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    TableCell,
    TableRow,
    Box,
    Collapse,
    IconButton,
    Typography,
    Avatar
} from "@mui/material";
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { Flex } from "gestalt";
import { currentPinState, isDarkModeState, isLoginState, pinModalOpenState } from "../../atom";
import api from '../../api';
import useSnackbar from '../../hooks/useSnackbar';
import { useNavigate } from 'react-router-dom';

const BaseRow = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [currentPin, setCurrentPin] = useRecoilState(currentPinState);
    const [pinOpen, setPinOpen] = useRecoilState(pinModalOpenState);
    const isDarkMode = useRecoilValue(isDarkModeState);
    const isLogin = useRecoilValue(isLoginState);
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    // 핀 데이터를 가져오는 함수
    const getPinByPId = async (pid) => {
        try {
            const response = await api.get(`/api/pins/${pid}`);
            setCurrentPin(response.data);
        } catch (error) {
            console.error(error);
            showSnackbar('error', '핀을 불러오는데 실패했습니다.');
        }
    };

    // 핀 모달 열기
    const handlePinOpen = () => {
        setPinOpen(true);
    };

    // 로그인 상태를 확인하고 핀 데이터를 가져오는 로직
    useEffect(() => {
        if (!isLogin) {
            showSnackbar('warning', '로그인 후 이용해주세요.');
            navigate('/');
            return;
        }
        getPinByPId(data.pinId);
    }, [isLogin, data.pinId, navigate, showSnackbar]);

    return (
        <Fragment>
            <TableRow sx={{
                '& > *': {
                    borderBottom: 'unset',
                    color: isDarkMode ? '#fff' : '#000'
                }
            }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                        color={isDarkMode ? 'inherit' : 'default'}
                        style={{ color: '#ff9472' }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? '#fff' : '#000' }} component="th" scope="row" align="left">
                    {data.pinId}
                </TableCell>
                <TableCell align="left"
                           sx={{
                               maxWidth: '200px',
                               whiteSpace: 'nowrap',
                               overflow: 'hidden',
                               textOverflow: 'ellipsis',
                               color: isDarkMode ? '#fff' : '#000'
                           }}>{data.content}</TableCell>
                <TableCell sx={{ color: isDarkMode ? '#fff' : '#000' }} align="left">{data.updatedDate}</TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                <Flex justifyContent={"between"}>
                                    <Flex>
                                        <Avatar src={currentPin.imagePath} alt={data.pinId}
                                                sx={{
                                                    width: 100, height: 'auto',
                                                    ":hover": {
                                                        cursor: "pointer",
                                                        transform: "scale(1.04)",
                                                        transition: "transform 0.3s ease"
                                                    }
                                                }} onClick={() => handlePinOpen()} />
                                        <Box sx={{ color: isDarkMode ? '#fff' : '#000' }}
                                             marginLeft={2}
                                             fontSize={"15px"} maxWidth={"400px"}>
                                            <Flex>
                                                <div style={{ fontSize: "20px", color: "#f2709c" }}>{data.nickname}</div>
                                                <div style={{ fontSize: "20px" }}> 의 핀</div>
                                            </Flex>
                                            {data.content}
                                        </Box>
                                    </Flex>
                                </Flex>
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
};

export default BaseRow;
