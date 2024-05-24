import React, {Fragment, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from 'recoil';
import {currentPinState, isDarkModeState, pinModalOpenState} from "../../atom";
import {
    TableCell,
    TableRow,
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
    Paper, Avatar
} from "@mui/material";
import {KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon} from '@mui/icons-material';
import {Flex, Heading, Sticky} from "gestalt";
import api from "../../api";
import styled from "styled-components";

export default function MyComment() {
    const [commentData, setCommentData] = useState([]);
    const isDarkMode = useRecoilValue(isDarkModeState);
    const [pinOpen, setPinOpen] = useRecoilState(pinModalOpenState);

    const getCommentData = async () => {
        try {
            const response = await api.get('/comment/list/my-comments');
            console.log(response.data);
            setCommentData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCommentData();
    }, []);

    const BaseRow = ({data}) => {
        const [open, setOpen] = useState(false);
        const [currentPin, setCurrentPin] = useRecoilState(currentPinState);

        const getPinByPId = async (pid) => {
            try {
                const response = await api.get(`/pin/${pid}`);
                setCurrentPin(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const handlePinOpen = () => {

            setPinOpen(true);
        }

        useEffect(() => {
            getPinByPId(data.pid);
        }, [])

        useEffect(() => {
            console.log(isDarkMode);
        }, [isDarkMode]);

        return (
            <Fragment>
                <TableRow sx={{'& > *': {borderBottom: 'unset', color: isDarkMode ? '#fff' : '#000'}}}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                            color={isDarkMode ? 'inherit' : 'default'}
                            style={{color: '#ff9472'}}
                        >
                            {open ? <KeyboardAgrrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </TableCell>
                    <TableCell sx={{color: isDarkMode ? '#fff' : '#000'}} component="th" scope="row" align="left">
                        {data.pid}
                    </TableCell>
                    <TableCell align="left"
                               sx={{
                                   maxWidth: '200px',
                                   whiteSpace: 'nowrap',
                                   overflow: 'hidden',
                                   textOverflow: 'ellipsis',
                                   color: isDarkMode ? '#fff' : '#000'
                               }}>{data.content}</TableCell>
                    <TableCell sx={{color: isDarkMode ? '#fff' : '#000'}} align="left">{data.updatedDate}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{margin: 1}}>
                                <Typography variant="h6" gutterBottom component="div">
                                    <Flex justifyContent={"between"}>
                                        <Flex>
                                            <Avatar src={currentPin.imagePath} alt={data.pid} sx={{
                                                width: 100, height: 'auto',
                                                ":hover": {
                                                    cursor: "pointer",
                                                    transform: "scale(1.04)",
                                                    transition: "transform 0.3s ease"
                                                }

                                            }} onClick={() => handlePinOpen()}/>
                                            <Box sx={{color: isDarkMode ? '#fff' : '#000'}} marginLeft={2}
                                                 fontSize={"15px"} maxWidth={"400px"}>
                                                <Flex>
                                                    <div style={{fontSize: "20px", color: "#f2709c"}}>{
                                                        data.nick}</div>
                                                    <div style={{fontSize: "20px"}}> 의 핀</div>
                                                </Flex>
                                                {data.content}
                                            </Box>
                                        </Flex>
                                    </Flex>
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableBody>

                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment>
        )
            ;
    };

    return (
        <Box minHeight={"calc(100vh - 154px)"} sx={{color: isDarkMode ? '#fff' : '#000'}}>
            <Sticky top={0}>
                <Box marginBottom={6}>
                    <Heading>나의 댓글</Heading>
                </Box>
            </Sticky>

            <TableContainer component={Paper} sx={{backgroundColor: isDarkMode ? '#111111' : '#fff'}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                borderBottom: isDarkMode ? '1px solid #CDCDCD' : '1px solid #E9E9E9'
                            }}/>
                            <TableCell sx={{
                                fontSize : "20px",
                                color: isDarkMode ? '#fff' : '#111111',
                                borderBottom: isDarkMode ? '1px solid #CDCDCD' : '1px solid #E9E9E9'
                            }}>Pin</TableCell>
                            <TableCell sx={{
                                fontSize : "20px",
                                color: isDarkMode ? '#fff' : '#111111',
                                borderBottom: isDarkMode ? '1px solid #CDCDCD' : '1px solid #E9E9E9',
                            }}>Content</TableCell>
                            <TableCell sx={{
                                fontSize : "20px",
                                color: isDarkMode ? '#fff' : '#111111',
                                borderBottom: isDarkMode ? '1px solid #CDCDCD' : '1px solid #E9E9E9'
                            }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {commentData.map((row) => (
                            <BaseRow key={row.cid} data={row}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}