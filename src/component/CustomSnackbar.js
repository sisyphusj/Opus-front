import {Snackbar} from "@mui/joy";
import {Button} from "@mui/material";
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import {useRecoilState, useRecoilValue} from "recoil";
import {snackMessageState, snackOpenState, snackTypeState} from "../atom";

export default function CustomSnackbar() {
    const [open, setOpen] = useRecoilState(snackOpenState);
    const snackbarMessage = useRecoilValue(snackMessageState);
    const snackbarType = useRecoilValue(snackTypeState);

    /**
     *   type : 'danger', 'neutral', 'primary', 'success', 'warning'
     */

    console.log(snackbarType);

    return (
        <Snackbar
            variant="soft"
            open={open}
            color={snackbarType}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            startDecorator={<PlaylistAddCheckCircleRoundedIcon/>}
            endDecorator={
                <Button
                    onClick={() => setOpen(false)}
                    size="sm"
                    variant="soft"
                    color="success"
                >
                    Dismiss
                </Button>
            }
        >
            {snackbarMessage}
        </Snackbar>
    );
}