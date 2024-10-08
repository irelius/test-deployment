import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComment, fetchComments } from '../../store/comment';
import { useModal } from '../../context/Modal';

export default function CreateComment({bountyId, onCommentCreated}) {
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // e.stopPropagation();

        const newComment = {
            comment,
            bountyId
        };

        const result = await dispatch(createComment(
            bountyId,
            newComment
        ));

        if (result.errors) {
            setErrors(result.errors);
        } else {
            onCommentCreated(result)
            await dispatch(fetchComments(bountyId))
            closeModal(); // Close modal on successful comment submission
        }

    };
    return(
        <>
            <form onSubmit={handleSubmit}>
                <h2>Leave a Comment</h2>
                {errors.length > 0 && (
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
                <button type="submit">Submit Comment</button>
            </form>
        </>
    )
}