import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBounties, removeBounty } from '../../store/bounty';
import { useNavigate } from 'react-router-dom';
import BountyCard from '../BountyCard/BountyCard';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import UpdateBountyForm from '../BountyModals/UpdateBountyForm';

export default function SplashPage() {
    const dispatch = useDispatch();
    // const bounties = useSelector(state => state.bounties.bounties)
    const bounties = useSelector(state => state.bounties.bounties);
    const user = useSelector(state => state.session.user);
    console.log("bounties", bounties)
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchBounties()); 
    }, [dispatch]);

    //Handlers
    const goToBounty = (e, bounty) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/bounty/${bounty.id}`); 
    };
    const goToCreateBounty = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/bounty/new`);  // Navigate to the Create Bounty form
    };
    const handleDelete = (bountyId) => {
        console.log("Deleting Bounty ID:", bountyId);
        dispatch(removeBounty(bountyId));
    };

    return(
        <>
            <div className="SplashPage">
                <div className="SplashPage-title">
                    <h1>Welcome Challenger</h1>
                    <p>Discover all available Bounties</p>
                </div>
                {user && ( // Show the button only if the user is logged in
                    <button className="create-bounty-button" onClick={goToCreateBounty}>
                        Create a Bounty
                    </button>
                )}
                <div className="SplashPage-bounties">
                    {bounties && bounties.map(bounty => (
                            <div key={bounty.id}>
                                <div className="SplashPage-bounty" onClick={(e) => goToBounty(e, bounty)}>
                                    <BountyCard  bounty={bounty} userId={user.id} />
                                </div>
                                {bounty.userId === user.id && (
                                    <div className="BountyCard-update-delete">
                                        <button>
                                            <OpenModalMenuItem
                                                modalComponent={<UpdateBountyForm bounty={bounty} />}
                                                itemText="Update Bounty"
                                            />
                                        </button>
                                        <button onClick={() => handleDelete(bounty.id)}>Delete Bounty</button>
                                    </div>
                                )}
                            </div>
                    ))}
                </div>
            </div>
        </>
    )
}