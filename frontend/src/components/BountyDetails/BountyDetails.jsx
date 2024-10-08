import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBounties } from '../../store/bounty';
import { fetchComments } from '../../store/comment';
import { createCompletedBounty, fetchCompletedBountyByBounty } from '../../store/completedBounty';
import { useParams } from 'react-router-dom';
import CommentCard from '../CommentCard/CommentCard';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateComment from '../CreateComment/CreateComment';
import { useModal } from '../../context/Modal';

export default function BountyDetails() {
    const dispatch = useDispatch();
    const { bountyId } = useParams(); // Get the bountyId from the URL
    const { loadUpdate, setLoadUpdate } = useModal();
    const bounty = useSelector(state => state.bounties.bounties.find(b => b.id === parseInt(bountyId)));
    const comments = useSelector(state => state);
    const user = useSelector(state => state.session.user);

    const [bountyComments, setBountyComments] = useState([]);
    const [load, setLoad] = useState(false)
    const [loadDelete, setLoadDelete] = useState(false)
    const [userCompletedBounty, setUserCompletedBounty] = useState(null);
    const [completedBountyByHandler, setCompletedBountyByHandler] = useState(false)
    // const comments = useSelector(state => Object.values(state.comments));

    useEffect(() => {
        const getData = async () => {
            await dispatch(fetchBounties()) // Fetch bounties if not already fetched
            console.log("MADE IT THIS FAR")
            console.log("COMMENTS",comments)
            console.log("bounty?.commentsCount",bounty?.commentsCount)
            if (bounty?.commentsCount > 0) {  // Adjust this based on your API response structure
                const fetchedComments = await dispatch(fetchComments(bountyId));
                console.log("MADE IT THIS FAR2");
                setBountyComments(fetchedComments);
            } else {
                setBountyComments([]);  // Set empty comments if no comments exist
            }
            // const fetchedComments = await dispatch(fetchComments(bountyId))
            console.log("MADE IT THIS FAR2")
            // console.log("Fetched Comments: ", fetchedComments);
            // setBountyComments(fetchedComments);
            setLoad(true)
        }
        getData()
        setLoadDelete(false)
        setLoadUpdate(false)
    }, [
        dispatch,
        bountyId,
        loadDelete,
        loadUpdate,
        bounty?.commentsCount, // Add missing dependencies
        comments,
        setLoadUpdate,
    ]);

    useEffect(() => {
        const getData = async () => {
            if (user) { //Has user completed bounty???
                // const completedBounty = await dispatch(fetchUserCompletedBounty(user.id, bountyId));
                const completedBounties = await dispatch(fetchCompletedBountyByBounty(bountyId));
                // console.log("COMPLETEDBOUNTIES", completedBounties)
                const userCompleted = completedBounties.find(bounty => bounty.userId === user.id);
                // console.log("USERCOMPLETED", userCompleted)
                if(userCompleted) {
                    setUserCompletedBounty(userCompleted);
                }
                
            }
        }
        getData()
    }, [dispatch, user, bountyId, completedBountyByHandler])
    
    if (!bounty) return <div>Loading bounty details...</div>;

    const handleCommentCreated = (newComment) => {
        setBountyComments(prevComments => [...prevComments, newComment]);
    };

    const handleBountyCompleted = () => {
        if (user) {
            dispatch(createCompletedBounty({ userId: user.id, bountyId: bounty.id, completed: true }));
            setCompletedBountyByHandler(true)
        }
    };

    // const bountyCommentsFiltered = comments.filter(comment => comment.bountyId === parseInt(bountyId));
    // console.log("BOUNTYCOMMENTS IN BOUNTYDETAILS", bountyComments)
    if(!load) {
        return <h1>Loading...</h1>
    } else {
        return (
            <>
                <div>
                    <h1>{bounty.title}</h1>
                    <p>{bounty.description}</p>
                    {/* <button onClick={handleBountyCompleted}>Bounty Completed</button> */}
                    {user && ( // Ensure the section only appears if a user is logged in
                        userCompletedBounty?.completed ? (
                            <p>Congratulations, You Have Completed This Bounty</p>
                        ) : (
                            <button onClick={handleBountyCompleted}>Bounty Completed</button>
                        )
                    )}
                </div>
                <div className="comments-section">
                    {user && (
                        <button>
                            <OpenModalMenuItem
                            itemText="Create a Comment"
                            modalComponent={<CreateComment bountyId={bountyId} onCommentCreated={handleCommentCreated} />}
                        />
                        </button>
                    )}
                    <h2>Comments</h2>
                    {bountyComments.length ? (
                        bountyComments.map(comment => (
                            <CommentCard key={comment.id} comment={comment} setLoadDelete={setLoadDelete} setLoadUpdate={setLoadUpdate} /> // Pass each comment to CommentCard
                        ))
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </>
        )
    }
    
}
