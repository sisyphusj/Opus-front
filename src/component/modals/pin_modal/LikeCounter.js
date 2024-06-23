import React, { useState, useEffect } from 'react';
import {Grow, Typography} from '@mui/material';

const LikeCounter = ({ likeCount }) => {
    const [prevCount, setPrevCount] = useState(likeCount);
    const [slideIn, setSlideIn] = useState(true);
    const [direction, setDirection] = useState('up');

    useEffect(() => {
        if (likeCount !== prevCount) {
            setSlideIn(false);
            setDirection(likeCount > prevCount ? 'up' : 'down');
            setTimeout(() => {
                setPrevCount(likeCount);
                setSlideIn(true);
            }, 200); // 애니메이션 지속 시간과 일치
        }
    }, [likeCount, prevCount]);

    return (
        <Grow in={slideIn} direction={direction} timeout={200}>
            <Typography variant="h6" component="div" style={{marginTop : "5px"}}>
                {prevCount}
            </Typography>
        </Grow>
    );
};

export default LikeCounter;
