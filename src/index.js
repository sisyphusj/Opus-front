import React from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";
import App from "./App";
import {RecoilRoot} from "recoil";

// const html = document.querySelector('html');
// html.setAttribute('dir', 'ltr');

const root = createRoot(document.getElementById("root"));
root.render(
    <RecoilRoot>
        <App/>
    </RecoilRoot>
);