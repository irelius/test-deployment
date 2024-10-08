import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateExistingBounty } from '../../store/bounty';
import { useModal } from '../../context/Modal';

export default function UpdateBountyForm({bounty}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [title, setTitle] = useState(bounty.title);
    const [description, setDescription] = useState(bounty.description);

    const isValidForm = () => {
        return title.trim().length > 0 && description.trim().length > 0 && 
               title.length <= 50 && description.length <= 500;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedBounty = {
            title,
            description,
        };
        dispatch(updateExistingBounty(bounty.id, updatedBounty));
        closeModal()
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Update Bounty</h2>
            <label>
                Title:
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </label>
            <label>
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <button type="submit" disabled={!isValidForm()}>Update</button>
        </form>
    )
}