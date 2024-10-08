

export default function BountyCard({bounty}) {
    // const dispatch = useDispatch();

    // const handleDelete = () => {
    //     dispatch(removeBounty(bounty.id));
    // };
    return (
        <div className="BountyCard">
        <h3>{bounty.title}</h3>
        <p>{bounty.description}</p>
        {/* {bounty.userId === userId && ( // Only show buttons for the owner
            <div className="BountyCard-update-delete">
                <button>
                    <OpenModalMenuItem
                        modalComponent={<UpdateBountyForm bounty={bounty} />} // You will create this component
                        itemText="Update Bounty"
                    />
                </button>
                <button onClick={handleDelete}>Delete Bounty</button>
            </div>
        )} */}
    </div>
    )
}