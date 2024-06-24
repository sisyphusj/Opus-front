import React from 'react';
import { Box, Button, ButtonGroup, Flex, NumberField, TextField } from 'gestalt';
import { Slider } from '@mui/material';
import styled from 'styled-components';

const Label = styled.h3`
  margin-left: 6px;
  margin-bottom: 4px;
  color: #F2709C;
`;

const ImageControls = ({
    direction,
    customWidth,
    setImgQuality,
    setGuidanceScale,
    seed,
    handleSeedChange,
    samples,
    setSamples,
    openArray,
    handleButtonGroup,
    handleFieldBorder,
    getImages,
    saveImage,
    loading,
    imgLoad,
    isLogin,
    seedFieldRef,
    numberFieldRef
}) => (
    <Box fit margin={2}>
        <Flex direction={direction} justifyContent={"between"}>
            <Box>
                <Box width={customWidth} margin={3} marginEnd={6}>
                    <Label>Sampling Steps</Label>
                    <Slider
                        aria-label="SamplingSteps"
                        defaultValue={50}
                        valueLabelDisplay="auto"
                        shiftStep={30}
                        step={5}
                        marks
                        min={10}
                        max={100}
                        onChange={(e) => setImgQuality(e.target.value)}
                        style={{ color: "#FF9472", marginBottom: "30px" }}
                    />

                    <Label>Guidance Scale</Label>
                    <Slider
                        aria-label="GuidanceScale"
                        defaultValue={5}
                        valueLabelDisplay="auto"
                        shiftStep={1}
                        step={1}
                        marks
                        min={4}
                        max={15}
                        onChange={(e) => setGuidanceScale(e.target.value)}
                        style={{ color: "#FF9472" }}
                    />
                </Box>

                <Flex>
                    <Box width={200} margin={3} marginTop={5}>
                        <Label>Seed</Label>
                        <TextField
                            id="seed"
                            onChange={handleSeedChange}
                            autoComplete="off"
                            size="md"
                            value={seed}
                            ref={seedFieldRef}
                            onFocus={() => handleFieldBorder(seedFieldRef, true)}
                            onBlur={() => handleFieldBorder(seedFieldRef, false)}
                        />
                    </Box>

                    <Box width={100} margin={3} marginTop={5}>
                        <Label>Samples</Label>
                        <NumberField
                            id="samples"
                            onChange={(v) => setSamples(v.value)}
                            autoComplete="off"
                            size="md"
                            min={1}
                            max={4}
                            ref={numberFieldRef}
                            value={samples}
                            onFocus={() => handleFieldBorder(numberFieldRef, true)}
                            onBlur={() => handleFieldBorder(numberFieldRef, false)}
                        />
                    </Box>
                </Flex>
            </Box>

            <Box width={"100%"} margin={3}>
                <Box>
                    <Label style={{ marginBottom: "6px" }}>Size</Label>
                    <ButtonGroup>
                        {['1024×1024', '1280×768', '768×1280', '512×512'].map((text, i) => (
                            <Button
                                key={text}
                                text={text}
                                selected={openArray[i]}
                                size="lg"
                                onClick={() => handleButtonGroup(i)}
                            />
                        ))}
                    </ButtonGroup>
                </Box>

                <Box fit marginTop={7}>
                    <Flex justifyContent={"start"} alignItems="stretch">
                        <Box width={200}>
                            <Button fullWidth={true} text={"Create Image"} onClick={getImages} size={"lg"} />
                            {!loading && imgLoad && isLogin && (
                                <Box marginTop={3}>
                                    <Button fullWidth={true} text={"Save"} onClick={saveImage} size={"lg"} />
                                </Box>
                            )}
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    </Box>
);

export default ImageControls;
