import { atom } from "recoil";

export const isDarkMode = atom({
    key: "isDarkMode",
    default: false
});

export const signUpOpenState = atom({
    key: "signUpOpenState",
    default: false,
});