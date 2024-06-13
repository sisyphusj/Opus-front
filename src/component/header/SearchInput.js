/**
 * SearchInput
 * - 검색창 컴포넌트
 * - gestalt의 SearchField 컴포넌트를 사용
 * - forwardRef를 사용하여 ref를 전달
 *  Header 컴포넌트에서 사용
 */
import React, {forwardRef} from 'react';
import {SearchField} from 'gestalt';

const SearchInput = forwardRef(
    ({value, onChange, onKeyDown, onFocus, onBlur}, ref) => (
        <SearchField
            accessibilityLabel="search"
            id="headerSearchField"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            size="lg"
            autoComplete="off"
            ref={ref}
            placeholder="검색"
        />
    ));

export default SearchInput;
