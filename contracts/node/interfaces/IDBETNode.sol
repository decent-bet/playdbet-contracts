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
    * @param timeThreshold Minimum of time tokens need to be held before node can be activated
    * @return Whether node was added
    */
    function addNode(
        string memory name,
        uint256 tokenThreshold,
        uint256 timeThreshold
    )
    public
    returns (bool);

}
