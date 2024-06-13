/**
 * useAppState hook
 * @description App.js 에서 사용되는 recoil 상태를 반환하는 hook
 */

import {useRecoilValue} from "recoil";
import {isDarkModeState, pinModalOpenState} from "../atom";

const useAppState = () => {
    const mode = useRecoilValue(isDarkModeState);
    const isPinOpen = useRecoilValue(pinModalOpenState);

    return {mode, isPinOpen};
};

export default useAppState;