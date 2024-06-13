/**
 * PinContainerStyle.js
 * @description 공통 컨테이너 스타일
 */
import styled from "styled-components";

export const PinContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 650px;
  overflow: auto;
  z-index: 998;

  &::-webkit-scrollbar {
    width: 0;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }
`;
