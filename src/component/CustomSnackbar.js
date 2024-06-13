import {Alert} from "@mui/material";
import {useRecoilState, useRecoilValue} from "recoil";
import {snackMessageState, snackOpenState, snackTypeState} from "../atom";
import Snackbar from "@mui/material/Snackbar";

export default function CustomSnackbar() {
    const [open, setOpen] = useRecoilState(snackOpenState);
    const snackbarMessage = useRecoilValue(snackMessageState);
    const snackbarType = useRecoilValue(snackTypeState);

    /**
     *   type : 'success', 'info', 'warning', 'error'
     */

    return (
        <Snackbar
            open={open}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
        >
            <Alert
                onClose={() => setOpen(false)}
                severity={snackbarType}
                variant={'filled'}
                sx={{width: '100%'}}
            >
                {snackbarMessage}
            </Alert>
        </Snackbar>
    );
}