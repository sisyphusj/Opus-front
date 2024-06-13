/**
 * GlobalStyle.js
 * @description 스크롤 전역 스타일 변경 파일
 */
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${(props) => (props.darkMode ? '#333' : '#f1f1f1')};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => (props.darkMode ? '#555' : '#aaa')};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => (props.darkMode ? '#777' : '#888')};
  }
`;

export default GlobalStyle;