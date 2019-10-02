pragma solidity 0.5.8;

import "./interfaces/IDBETNode.sol";
import "./libs/LibDBETNode.sol";

import "../admin/Admin.sol";
import "../quest/Quest.sol";
import "../token/ERC20.sol";
import "../tournament/Tournament.sol";
import "./NodeWallet.sol";

import "../utils/SafeMath.sol";

contract DBETNode is
IDBETNode,
LibDBETNode {

    using SafeMath for uint256;

    // Address of contract deployer
    address public owner;

    // Admin contract
    Admin public admin;
    // Quest contract
    Quest public quest;
    // Tournament contract
    Tournament public tournament;
    // Token contract
    ERC20 public token;
    // NodeWallet contract
    NodeWallet public nodeWallet;

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

    event LogSetContracts(
        address quest,
        address tournament
    );
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
    * Sets the quest,  contract address
    * @param _quest Quest contract address
    * @param _tournament Tournament contract address
    * @return Whether the contract addresses were set
    */
    function setContracts(
        address _quest,
        address _tournament
    )
    public
    returns (bool) {
        quest = Quest(_quest);
        tournament = Tournament(_tournament);
        nodeWallet = new NodeWallet();
        emit LogSetContracts(
            _quest,
            _tournament
        );
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
        // Node count for node type must be lesser than max count
        require(
            nodes[node].count.add(1) <= nodes[node].maxCount,
            "MAX_NODE_COUNT_EXCEEDED"
        );
        // Add user node
        userNodes[userNodeCount] = UserNode({
            node: node,
            owner: msg.sender,
            deposit: nodes[node].tokenThreshold,
            creationTime: now,
            destroyTime: 0,
            index: nodes[node].count
        });
        // Increment node count
        nodes[node].count++;
        // Assign node ownership for node type to user
        nodeOwnership[msg.sender][node] = true;
        // Transfer threshold tokens to contract
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                nodes[node].tokenThreshold
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Emit create user node event
        emit LogCreateUserNode(userNodeCount++);
        return true;
    }

    /**
    * Destroys an active user node and returns the locked DBETs to the node owner
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
        // Set destroy time for node
        userNodes[id].destroyTime = now;
        // Revoke node ownership of node type for user
        nodeOwnership[msg.sender][userNodes[id].node] = false;
        // Decrement number of nodes of user node type
        nodes[userNodes[id].node].count--;
        // Transfer tokens to user
        require(
            token.transfer(
                msg.sender,
                userNodes[id].deposit
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Emit log destroy user node event
        emit LogDestroyUserNode(id);
        return true;
    }

    /**
    * Adds a new node
    * @param name Name of node
    * @param tokenThreshold Minimum of tokens required to be held before node can be activated
    * @param timeThreshold Minimum time tokens need to be held before node can be activated
    * @param maxCount Maximum number of nodes of this type that can be active at a time
    * @param rewards Array of reward IDs linked to this node type
    * @return Whether node was added
    */
    function addNode(
        string memory name,
        uint256 tokenThreshold,
        uint256 timeThreshold,
        uint256 maxCount,
        uint8[] memory rewards
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
        // Must be a non-zero max count
        require(
            maxCount > 0,
            "INVALID_MAX_COUNT"
        );
        // Must be valid rewards array
        require(
            rewards.length > 0 &&
            rewards.length <= uint8(Rewards.CREATE_TOURNAMENT) + 1,
            "INVALID_REWARDS_ARRAY_LENGTH"
        );
        // Validate rewards array
        for (uint256 i = 0; i < rewards.length; i++) {
            // TODO: Check for duplicates
            require(
                // Check if within valid rewards range
                rewards[i] >= 0 &&
                rewards[i] <= uint8(Rewards.CREATE_TOURNAMENT),
                "INVALID_REWARDS_ARRAY"
            );
        }
        nodes[nodeCount] = Node({
            name: name,
            tokenThreshold: tokenThreshold,
            timeThreshold: timeThreshold,
            maxCount: maxCount,
            rewards: rewards,
            count: 0
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
            // Must be a created user node
            userNodes[id].creationTime != 0 &&
            // Must not be an already destroyed user node
            userNodes[id].destroyTime == 0 &&
            (
            // Must have a deposit greater than or equal to the token threshold
            userNodes[id].deposit >= nodes[userNodes[id].node].tokenThreshold
            ) &&
            (
                // Must have been created at least `timeThreshold` seconds before now
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

    /**
    * Returns node owner for a given node ID
    * @param id Unique user node ID
    * @return Returns owner address of a node
    */
    function getNodeOwner(
        uint256 id
    )
    public
    view
    returns (address) {
        return userNodes[id].owner;
    }

    /**
    * Returns whether a node has quest rewards
    * @param id Unique user node ID
    * @return Whether node has quest rewardsk
    */
    function isQuestNode(
        uint256 id
    )
    public
    view
    returns (bool) {
        bool _isQuestNode = false;
        for (uint256 i = 0; i < nodes[userNodes[id].node].rewards.length; i++) {
            if (nodes[userNodes[id].node].rewards[i] == uint8(Rewards.CREATE_QUEST))
                _isQuestNode = true;
        }
        return _isQuestNode;
    }

}
