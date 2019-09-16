pragma solidity 0.5.8;

import "./interfaces/IDBETNode.sol";
import "./libs/LibDBETNode.sol";

import "../admin/Admin.sol";

import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract DBETNode is
IDBETNode,
LibDBETNode {

    address public owner;

    // Admin contract
    Admin public admin;
    // Token contract
    ERC20 public token;

    // Maps incremented indices of added node types to NodeType structs
    mapping (uint256 => NodeType) public nodeTypes;
    // Auto-increment on addition of node types
    uint256 public nodeTypeCount;

    // Maps incremented indices of created nodes to Node structs
    mapping (uint256 => Node) public nodes;
    // Auto-increment on creation of nodes
    uint256 public userNodeCount;

    event LogNewNode(
        uint256 id
    );
    event LogNewNodeType(
        uint256 id
    );

    constructor(
        address _admin,
        address _token
    )
    public {
        owner = msg.sender;
        admin = Admin(_admin);
        token = ERC20(_token);
    }

    /**
    * Create a new DBET node by depositing the required token threshold
    * @param nodeType unique ID of nodeType
    * @return whether node was created
    */
    function create(
        uint256 nodeType
    )
    public
    returns (bool) {
        // Validate node type
        require(
            nodeTypes[nodeType].timeThreshold != 0,
            "INVALID_NODE_TYPE"
        );
        // User must meet the token requirement threshold
        require(
            token.balanceOf(msg.sender) > nodeTypes[nodeType].tokenThreshold,
            "INVALID_TOKEN_BALANCE"
        );
        // User must have approved DBETNode contract to transfer tokens on users' behalf
        require(
            token.allowance(
                msg.sender,
                address(this)
            ) > nodeTypes[nodeType].tokenThreshold,
            "INVALID_TOKEN_BALANCE"
        );
        nodes[userNodeCount] = Node({
            nodeType: nodeType,
            deposit: nodeTypes[nodeType].tokenThreshold,
            creationTime: now
        });
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                nodeTypes[nodeType].tokenThreshold
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        emit LogNewNode(userNodeCount++);
        return true;
    }

    /**
    * Destroys an active node and returns the locked DBETs to the node owner
    * @param id unique ID of node
    * @return whether node was destroyed
    */
    function destroy()
    public
    returns (bool) {
        return true;
    }

    /**
    * Adds a new node type
    * @param name Name of node
    * @param tokenThreshold Minimum of tokens required to be held before node can be activated
    * @param timeThreshold Minimum of time tokens need to be held before node can be activated
    * @return whether type was added
    */
    function addType(
        string name,
        uint256 tokenThreshold,
        uint256 timeThreshold
    )
    public
    returns (bool) {
        // Sender must be an admin
        require(
            admin.admins(msg.sender),
            "INVALID_SENDER"
        );
        // Name cannot be empty
        require(
            name != "",
            "INVALID_NAME"
        );
        // Must be a non-zero token threshold
        require(
            tokenThreshold > 0,
            "INVALID_TOKEN_THRESHOLD"
        );
        // Must be a non-zero time threshold
        require(
            timeThreshold > 0,
            "INVALID_TIME_THRESHOLD"
        );
        nodeTypes[nodeTypeCount] = NodeType({
            name: name,
            tokenThreshold: tokenThreshold,
            timeThreshold: timeThreshold
        });
        emit LogNewNodeType(nodeTypeCount++);
        return true;
    }

    /**
    * Returns whether a node has been activated
    * @param id Node ID
    * @return whether node was activated
    */
    function isNodeActivated(
        uint256 id
    )
    view
    returns (bool) {
        return (
            nodes[id].creationTime != 0 &&
            (
                nodes[id].deposit > 0
            ) &&
            (
                now >=
                (
                    nodes[id].creationTime +
                    nodesTypes[nodes[id].nodeType].timeThreshold
                )
            )
        );
    }

}
