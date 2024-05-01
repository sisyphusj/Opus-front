import { atom } from "recoil";
import {recoilPersist} from "recoil-persist";

export const isDarkMode = atom({
    key: "isDarkMode",
    default: false
});

export const signUpOpenState = atom({
    key: "signUpOpenState",
    default: false,
});

export const PinModalOpenState = atom({
    key: "PinModalOpenState",
    default: false,
});

const {persistAtom}  = recoilPersist({
    key: 'recoil-persist',
    storage: sessionStorage,
});

export const isLoginState = atom({
    key: "isLoginState",
    default: false,
    effects_UNSTABLE: [persistAtom],
});





