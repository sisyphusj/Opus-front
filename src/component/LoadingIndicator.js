import React from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg';
import styled from "styled-components";
import {Background} from "./CommonModal";

const LoadingIndicator = () => {
    const pulseAnimation = {
        animation: 'pulse 1.5s infinite',
        width: '300px', // Adjust the size as needed
        height: '300px'
    };

    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.7;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(styleElement);

    return (
        <Background>
            <Logo style={pulseAnimation} />
        </Background>
    );
};

export default LoadingIndicator;