import React from 'react';
import { IconButton, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const MoreOptions = ({ open, anchorRef, handleToggle, handleClose, handleUpdateButton, deleteComment }) => (
    <div ref={anchorRef} style={{ position: 'relative' }}>
        <IconButton onClick={handleToggle} ref={anchorRef}>
            <MoreHorizIcon />
        </IconButton>
        <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
            style={{ zIndex: 3 }}
        >
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button">
                                <MenuItem onClick={handleUpdateButton}>수정</MenuItem>
                                <MenuItem onClick={deleteComment}>삭제</MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    </div>
);

export default MoreOptions;
