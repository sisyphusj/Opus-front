import React from "react";
import {useRecoilValue} from 'recoil';
import { isDarkModeState } from "../../atom";
import {
    TableCell,
    TableRow,
    Box,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Paper
} from "@mui/material";
import {Heading, Sticky} from "gestalt";
import useMyComments from "../../hooks/useMyComment";
import BaseRow from "../../component/comment/BaseRow";

const MyComment = () => {
    const {commentData} = useMyComments();
    const isDarkMode = useRecoilValue(isDarkModeState);

    return (
        <Box minHeight={"calc(100vh - 154px)"}
             sx={{color: isDarkMode ? '#fff' : '#000'}}>
            <Sticky top={0}>
                <Box marginBottom={6}>
                    <Heading>나의 댓글</Heading>
                </Box>
            </Sticky>

            <TableContainer component={Paper}
                            sx={{
                                backgroundColor: isDarkMode ? '#111111' : '#fff'
                            }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                borderBottom: isDarkMode ? '1px solid #CDCDCD'
                                    : '1px solid #E9E9E9'
                            }}/>
                            <TableCell sx={{
                                fontSize: "20px",
                                color: isDarkMode ? '#fff' : '#111111',
                                borderBottom: isDarkMode ? '1px solid #CDCDCD'
                                    : '1px solid #E9E9E9'
                            }}>Pin</TableCell>
                            <TableCell sx={{
                                fontSize: "20px",
                                color: isDarkMode ? '#fff' : '#111111',
                                borderBottom: isDarkMode ? '1px solid #CDCDCD'
                                    : '1px solid #E9E9E9',
                            }}>Content</TableCell>
                            <TableCell sx={{
                                fontSize: "20px",
                                color: isDarkMode ? '#fff' : '#111111',
                                borderBottom: isDarkMode ? '1px solid #CDCDCD'
                                    : '1px solid #E9E9E9'
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
export default MyComment;