import React from 'react';
import { Box, SearchField } from 'gestalt';
import styled from 'styled-components';

const Label = styled.h3`
  margin-left: 6px;
  margin-bottom: 4px;
  color: #F2709C;
`;

const PromptField = React.forwardRef(({ label, value, onChange, handleFieldBorder }, ref) => (
    <Box margin={4}>
        <Label>{label}</Label>
        <SearchField
            accessibilityLabel={"search"}
            id={label.toLowerCase()}
            onChange={({ value }) => onChange(value)}
            value={value}
            size="lg"
            autoComplete={"off"}
            ref={ref}
            onFocus={() => handleFieldBorder(ref, true)}
            onBlur={() => handleFieldBorder(ref, false)}
        />
    </Box>
));

export default PromptField;
