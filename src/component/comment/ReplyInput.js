import React from 'react';
import { Flex } from "gestalt";
import { IconButton } from "@mui/material";
import { CustomInput } from '../CommonModal';
import { Close } from "@mui/icons-material";

const ReplyInput = ({ reply, setReply, handleOnKeyDown, handleCloseReply, inputRef }) => (
    <Flex direction={"row"} alignItems={"center"}>
        <CustomInput
            id="reply_field"
            label="Reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            size="normal"
            onKeyDown={(e) => handleOnKeyDown(e.key)}
            InputProps={{
                sx: {
                    borderRadius: '1.5rem',
                    width: '380px',
                },
            }}
            inputRef={inputRef}
        />
        <IconButton onClick={handleCloseReply} size={"medium"}>
            <Close fontSize={"small"} />
        </IconButton>
    </Flex>
);

export default ReplyInput;
