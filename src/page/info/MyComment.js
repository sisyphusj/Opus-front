import api from "../../api";
import {Fragment, useEffect, useState} from "react";
import {TableCell, TableRow} from "@mui/material";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Heading, Sticky} from "gestalt";


export default function MyComment() {
    const [commentData, setCommentData] = useState([]);

    const getCommentData = async () => {
        try {
            const response = await api.get('/comment/list/my-comments');
            console.log(response.data);
            setCommentData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCommentData();
    }, []);


    const BaseRow = ({data}) => {
        const [open, setOpen] = useState(false);

        return (
            <Fragment>
                <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </TableCell>

                    <TableCell component="th" scope="row">
                        {data.nick}
                    </TableCell>
                    <TableCell align="right">{data.content}</TableCell>
                    <TableCell align="right">{data.updatedDate}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{margin: 1}}>
                                <Typography variant="h6" gutterBottom component="div">
                                    History
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    sample
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment>
        );
    }

    return (
        <Box minHeight={"calc(100vh - 154px)"}>
            <Sticky top={0}>
                <Box marginBottom={6}>
                    <Heading> 나의 댓글 </Heading>
                </Box>
            </Sticky>

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>Nickname</TableCell>
                            <TableCell> Content</TableCell>
                            <TableCell> Date</TableCell>
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