pragma solidity 0.5.8;

contract IDBETNode {

    /**
    * Create a new DBET user node by depositing the required token threshold
    * @param node unique ID of node
    * @return whether node was created
    */
    function create(
        uint256 node
    )
    public
    returns (bool);

    /**
    * Destroys an active user node and returns the locked DBETs to the node owner
    * @param id unique ID of node
    * @return whether node was destroyed
    */
    function destroy(
        uint256 id
    )
    public
    returns (bool);

    /**
    * Adds a new node
    * @param name Name of node
    * @param tokenThreshold Minimum of tokens required to be held before node can be activated
    * @param timeThreshold Minimum time tokens need to be held before node can be activated
    * @param maxCount Maximum number of nodes of this type that can be active at a time
    * @param rewards Array of reward IDs linked to this node type
    * @param entryFeeDiscount Entry fee discount
    * @param increasedPrizePayout % increment on prizes won from quests by node holders
    * @param nodeType Type of node
    * @return Whether node was added
    */
    function addNode(
        string memory name,
        uint256 tokenThreshold,
        uint256 timeThreshold,
        uint256 maxCount,
        uint8[] memory rewards,
        uint256 entryFeeDiscount,
        uint256 increasedPrizePayout,
        uint8 nodeType
    )
    public
    returns (bool);

}
