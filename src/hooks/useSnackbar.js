/**
 * useSnackbar.js
 * @file Custom hook for snackbar
 */

import {useRecoilState} from 'recoil';
import {snackMessageState, snackOpenState, snackTypeState} from '../atom';
import {useCallback} from 'react';

const useSnackbar = () => {
    const [, setOpen] = useRecoilState(snackOpenState);
    const [, setSnackbarMessage] = useRecoilState(snackMessageState);
    const [, setSnackbarType] = useRecoilState(snackTypeState);

    const showSnackbar = useCallback((type, message) => {
        setSnackbarType(type);
        setSnackbarMessage(message);
        setOpen(true);
    }, [setSnackbarType, setSnackbarMessage, setOpen]);

    return {showSnackbar};
};

export default useSnackbar;

