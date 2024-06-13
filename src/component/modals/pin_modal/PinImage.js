/**
 * PinImage.js
 * @file Image component for PinModal
 */
import React from 'react';
import styled from "styled-components";

const PinImgH = styled.img`
  border-radius: 1.2em;
  width: auto;
  height: 100%;
`;

const PinImgW = styled.img`
  border-radius: 1.2em;
  width: 100%;
  height: auto;
`;

const PinImage = ({ src, alt, isWide }) => {
    return isWide ? <PinImgW src={src} alt={alt} /> : <PinImgH src={src} alt={alt} />;
};

export default PinImage;
