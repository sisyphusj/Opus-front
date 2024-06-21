import React, {useEffect, useRef} from 'react';
import Comment from './Comment';

const useTopLevelComments = (comments) => {
    return comments.filter(comment => comment.topLevelCommentId === null);
};

const Comments = ({comments}) => {
    const topLevelComments = useTopLevelComments(comments);
    const bottomRef = useRef(null);
    const isInitialMount = useRef(0);

    useEffect(() => {
        if (isInitialMount.current < 2) {
            isInitialMount.current++;
        } else if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [comments]);

    return (
        <div>
            {topLevelComments.map(comment => (
                <Comment key={comment.commentId} comment={comment}
                         comments={comments}/>
            ))}
            <div ref={bottomRef}/>
        </div>
    );
};

export default Comments;
