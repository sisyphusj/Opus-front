/**
 * @name PinDeleteButton
 * @description Delete button for pins
 * @description 핀 삭제 버튼
 */
import styled from "styled-components";

const PinDeleteButton = styled.button`
  width: 100px;
  height: 30px;
  margin-left: 40px;
  margin-top: 4px;
  background-color: transparent;
  border-radius: 1.5rem;
  color: #ff9472;
  font-size: 15px;
  font-weight: bold;
  border: 1px solid #ff9472;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ff9472;
    color: white;
  }
`;

export default PinDeleteButton;
