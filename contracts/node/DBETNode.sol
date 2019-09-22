pragma solidity 0.5.8;

import "./interfaces/IDBETNode.sol";
import "./libs/LibDBETNode.sol";

import "../admin/Admin.sol";

import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract DBETNode is
IDBETNode,
LibDBETNode {

    using SafeMath for uint256;

    // Address of contract deployer
    address public owner;

    // Admin contract
    Admin public admin;
    // Token contract
    ERC20 public token;

    // Maps incremented indices of added node offerings to Node structs
    mapping (uint256 => Node) public nodes;
    // Auto-increment on addition of nodes
    uint256 public nodeCount;

    // Maps incremented indices of created nodes to UserNode structs
    mapping (uint256 => UserNode) public userNodes;
    // Auto-increment on creation of nodes
    uint256 public userNodeCount;

    // Maps addresses to node types and a bool representing whether the user owns the node type
    mapping (address => mapping (uint256 => bool)) nodeOwnership;

    event LogCreateUserNode(
        uint256 id
    );
    event LogDestroyUserNode(
        uint256 id
    );
    event LogNewNode(
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
    * Create a new DBET user node by depositing the required token threshold
    * @param node unique ID of node
    * @return whether node was created
    */
    function create(
        uint256 node
    )
    public
    returns (bool) {
        // Validate node type
        require(
            nodes[node].timeThreshold != 0,
            "INVALID_NODE_TYPE"
        );
        // User cannot already own the same node
        require(
            !nodeOwnership[msg.sender][node],
            "NODE_TYPE_ALREADY_OWNED"
        );
        // User must meet the token requirement threshold
        require(
            token.balanceOf(msg.sender) >= nodes[node].tokenThreshold,
            "INVALID_TOKEN_BALANCE"
        );
        // User must have approved DBETNode contract to transfer tokens on users' behalf
        require(
            token.allowance(
                msg.sender,
                address(this)
            ) >= nodes[node].tokenThreshold,
            "INVALID_TOKEN_ALLOWANCE"
        );
        userNodes[userNodeCount] = UserNode({
            node: node,
            owner: msg.sender,
            deposit: nodes[node].tokenThreshold,
            creationTime: now,
            destroyTime: 0
        });
        nodeOwnership[msg.sender][node] = true;
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                nodes[node].tokenThreshold
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        emit LogCreateUserNode(userNodeCount++);
        return true;
    }

    /**
    * Destroys an active node and returns the locked DBETs to the node owner
    * @param id unique ID of node
    * @return whether node was destroyed
    */
    function destroy(
        uint256 id
    )
    public
    returns (bool) {
        // Check whether the node ID is valid
        require(
            userNodes[id].creationTime != 0,
            "INVALID_NODE"
        );
        // Check whether the node ID has not already been destroyed
        require(
            userNodes[id].destroyTime == 0,
            "INVALID_NODE"
        );
        // Check whether sender is the node owner
        require(
            userNodes[id].owner == msg.sender,
            "INVALID_NODE_OWNER"
        );
        userNodes[id].destroyTime = now;
        nodeOwnership[msg.sender][userNodes[id].node] = false;
        // Transfer tokens to user
        require(
            token.transfer(
                msg.sender,
                userNodes[id].deposit
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        emit LogDestroyUserNode(id);
        return true;
    }

    /**
    * Adds a new node
    * @param name Name of node
    * @param tokenThreshold Minimum of tokens required to be held before node can be activated
    * @param timeThreshold Minimum of time tokens need to be held before node can be activated
    * @return whether type was added
    */
    function addNode(
        string memory name,
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
            bytes(name).length > 0,
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
        nodes[nodeCount] = Node({
            name: name,
            tokenThreshold: tokenThreshold,
            timeThreshold: timeThreshold
        });
        emit LogNewNode(nodeCount++);
        return true;
    }

    /**
    * Returns whether a user node is activated
    * @param id Node ID
    * @return whether node is activated
    */
    function isUserNodeActivated(
        uint256 id
    )
    public
    view
    returns (bool) {
        return (
            userNodes[id].creationTime != 0 &&
            userNodes[id].destroyTime == 0 &&
            (
            userNodes[id].deposit > 0
            ) &&
            (
                now >=
                (
                    userNodes[id].creationTime.add(
                        nodes[userNodes[id].node].timeThreshold
                    )
                )
            )
        );
    }

    /**
    * Returns whether a user owns a node type
    * @param user Address of user
    * @param node Unique node ID
    * @return Whether user owns the node type
    */
    function isUserNodeOwner(
        address user,
        uint256 node
    )
    public
    view
    returns (bool) {
        return nodeOwnership[user][node];
    }

}
