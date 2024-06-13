/**
 * HeaderIconButton.js
 * @description Header 에서 사용되는 IconButton 컴포넌트
 * @description IconButton 컴포넌트를 간편하게 사용하기 위한 컴포넌트
 */

import React from 'react';
import {IconButton} from 'gestalt';

const HeaderIconButton = ({icon, accessibilityLabel, onClick}) => (
    <IconButton
        accessibilityLabel={accessibilityLabel}
        icon={icon}
        size="lg"
        onClick={onClick}
    />
);

export default HeaderIconButton;
