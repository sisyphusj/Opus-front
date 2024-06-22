/**
 * @file PinChangeButton.js
 * @description 사용자의 비밀번호 변경 버튼 컴포넌트
 * @component PinChangeButton
 */
import styled from "styled-components";
import { CustomButton } from "../modals/CommonModal";

const ChangeButton = styled(CustomButton)`
  width: 90px;
  height: 49px;
  border-radius: 1rem;
  font-size: 16px;
`;

export default ChangeButton;
