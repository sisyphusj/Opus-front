import CustomModal from "../CommonModal";
import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {Mask} from "gestalt";
import {useRecoilState} from "recoil";
import {pinModalOpenState} from "../../../atom";
import api from "../../../api";
import useSnackbar from "../../../hooks/useSnackbar";
import PinDetails from "./PinDetails";
import usePinData from "../../../hooks/usePinData";
import {
    MODAL_HEIGHT_LARGE, MODAL_HEIGHT_MEDIUM,
    MODAL_WIDTH_LARGE,
    MODAL_WIDTH_MEDIUM, MODAL_WIDTH_SMALL
} from "../../../constants/modalDimensions";
import {PinContainer} from "../../../styles/PinContainerStyle";

export default function PinModal() {

    const [isOpen, setIsOpen] = useRecoilState(pinModalOpenState);
    const [direction, setDirection] = useState('row');
    const [isDelete, setIsDelete] = useState(false);
    const [isMyPin, setIsMyPin] = useState(false);


    const [w, setW] = useState("1200px");
    const [h, setH] = useState("700px");
    const {showSnackbar} = useSnackbar();

    const {
        pinData,
        commentList,
        comment,
        setComment,
        nickname,
        getPinCommentData,
        submitComment,
        handleLike,
        isLike
    } = usePinData();

    /**
     * 모달을 열고 닫는 함수
     * @type {(function(*): void)|*}
     */
    const handleModal = useCallback((bool) => {
        setIsOpen(bool);
    }, [setIsOpen]);

    /**
     * 핀을 삭제하는 함수
     * @type {(function(): Promise<void>)|*}
     */
    const deletePin = useCallback(async () => {
        try {
            const response = await api.delete(`/api/pins/${pinData.pinId}`);
            // console.log(response);
            setIsOpen(false);
            showSnackbar('success', '핀이 삭제되었습니다.');

            setTimeout(() => {
                //TODO reload 방식 대신 리렌더링 구현
                window.location.reload();
            }, 1500);
        } catch (e) {
            console.error(e);
        }
    }, [pinData, setIsOpen]);

    /**
     * 댓글 입력창에서 엔터키를 누르면 댓글을 등록하는 함수
     * @type {(function(*): void)|*}
     */
    const handleOnKeyDown = useCallback((e) => {
        if (e === 'Enter') {
            submitComment();
        }
    }, [submitComment]);

    /**
     * 모달이 열릴 때 핀의 댓글 데이터와 사용자의 닉네임을 불러온다.
     */
    useEffect(() => {
        getPinCommentData();
    }, [getPinCommentData]);

    /**
     * 핀의 닉네임과 사용자의 닉네임이 같은지 비교하여 같으면 삭제 버튼을 보여준다.
     */
    useEffect(() => {
        if (pinData.nickname === nickname) {
            setIsMyPin(true);
        } else {
            setIsMyPin(false);
        }
    }, [pinData, nickname]);

    /**
     * 화면의 크기에 따라 모달의 방향을 결정한다.
     * 화면의 크기에 따라 모달의 너비와 높이를 결정한다.
     */
    useLayoutEffect(() => {
        function updateDirection() {
            setDirection(window.innerWidth > 1300 ? 'row' : 'column');

            if (window.innerWidth > 1300) {
                setW(MODAL_WIDTH_LARGE);
            } else if (window.innerWidth > 640) {
                setW(MODAL_WIDTH_MEDIUM);
            } else {
                setW(MODAL_WIDTH_SMALL);
            }
            setH(window.innerHeight > 800 ? MODAL_HEIGHT_LARGE : MODAL_HEIGHT_MEDIUM);
        }

        updateDirection();
        window.addEventListener('resize', updateDirection);
        return () => window.removeEventListener('resize', updateDirection);
    }, []);

    return (
        <CustomModal isOpen={isOpen} handleModal={handleModal} type={"lg"}>
            <Mask width={w} height={h} rounding={6}>
                <PinContainer>
                    <PinDetails
                        direction={direction}
                        pinData={pinData}
                        isMyPin={isMyPin}
                        isDelete={isDelete}
                        setIsDelete={setIsDelete}
                        commentList={commentList}
                        comment={comment}
                        setComment={setComment}
                        handleOnKeyDown={handleOnKeyDown}
                        handleLike={handleLike}
                        isLike={isLike}
                        handleDeleteConfirm={deletePin}
                    />
                </PinContainer>
            </Mask>
        </CustomModal>
    )
}
