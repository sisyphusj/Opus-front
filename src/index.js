import React from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";
import App from "./App";
import {RecoilRoot} from "recoil";

// const html = document.querySelector('html');
// html.setAttribute('dir', 'ltr');
const link = document.createElement('link');
link.rel= 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
document.head.appendChild(link);

const style = document.createElement('style');
style.innerHTML = `
  * {
    font-family: 'Roboto', sans-serif;
  }
`;

document.head.appendChild(style);

const root = createRoot(document.getElementById("root"));
root.render(
    <RecoilRoot>
        <App/>
    </RecoilRoot>
);