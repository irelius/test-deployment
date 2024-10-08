import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editComment } from '../../store/comment';
import { useModal } from '../../context/Modal';

export default function UpdateCommentForm({comment}) {
    const dispatch = useDispatch();
    const { closeModal, setLoadUpdate } = useModal();
    const [updatedComment, setUpdatedComment] = useState(comment.comment);
    // console.log("COMMENT INSIDE UPDATECOMMENTFORM", comment)

    const isValidForm = () => {
        return updatedComment.trim().length > 0 && updatedComment.length <= 500;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await dispatch(editComment(
            comment.boungtyId,
            comment.id,
            { comment: updatedComment }
        ));
        //refetch comments to deal with User not loading issue 
        //in congruence with backend/routes/api/comment.js updatedComment
        // await dispatch(fetchComments(comment.bountyId)); //<<<<
        // window.location.reload(); //The worst fix ever
        setLoadUpdate(true)
        closeModal()

    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Update Comment</h2>
                <label>
                    Comment:
                    <textarea
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                    />
                </label>
                <button type="submit" disabled={!isValidForm()}>Update</button>
            </form>
        </>
    )
}