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
    mapping (address => uint256) public nodeOwnership;

    event LogSetContracts(
        address quest,
        address tournament
    );
    event LogCreateUserNode(
        uint256 indexed id,
        address indexed user
    );
    event LogUpgradeUserNode(
        uint256 indexed id,
        uint256 indexed previousNodeType,
        uint256 indexed newNodeType
    );
    event LogDestroyUserNode(
        uint256 indexed id,
        address indexed user
    );
    event LogNewNode(
        uint256 indexed id
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
    * @param node Unique ID of node type
    * @return Whether node was created
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
        // User cannot already own a node
        require(
            nodeOwnership[msg.sender] == 0,
            "NODE_ALREADY_OWNED"
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
        // Add user node - userNodeCount would start with 1-index
        userNodes[++userNodeCount] = UserNode({
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
        nodeOwnership[msg.sender] = node;
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
        emit LogCreateUserNode(
            userNodeCount,
            msg.sender
        );
        return true;
    }

    /**
    * Upgrades an existing node by locking up additional collateral
    * @param id unique ID of node
    * @param upgradeNodeType Node type to upgrade to
    * @return Whether node was upgraded
    */
    function upgrade(
        uint256 id,
        uint256 upgradeNodeType
    )
    public
    returns (bool) {
        // Validate node type
        require(
            nodes[upgradeNodeType].timeThreshold != 0,
            "INVALID_NODE_TYPE"
        );
        // User cannot already own the same node
        require(
            nodeOwnership[msg.sender] != upgradeNodeType,
            "NODE_TYPE_ALREADY_OWNED"
        );
        // Must be an upgrade
        require(
            nodes[upgradeNodeType].tokenThreshold > userNodes[id].deposit,
            "MUST_BE_UPGRADE"
        );
        uint256 tokenRequirement = nodes[upgradeNodeType].tokenThreshold.sub(userNodes[id].deposit);
        // User must meet the token requirement threshold
        require(
            token.balanceOf(msg.sender) >= tokenRequirement,
            "INVALID_TOKEN_BALANCE"
        );
        // User must have approved DBETNode contract to transfer tokens on users' behalf
        require(
            token.allowance(
                msg.sender,
                address(this)
            ) >= tokenRequirement,
            "INVALID_TOKEN_ALLOWANCE"
        );
        // Node count for node type must be lesser than max count
        require(
            nodes[upgradeNodeType].count.add(1) <= nodes[upgradeNodeType].maxCount,
            "MAX_NODE_COUNT_EXCEEDED"
        );
        // Update user node
        uint256 previousNodeType = userNodes[id].node;
        userNodes[id].node = upgradeNodeType;
        userNodes[id].deposit = nodes[upgradeNodeType].tokenThreshold;
        userNodes[id].index = nodes[upgradeNodeType].count;
        // Increment node type count
        nodes[upgradeNodeType].count++;
        // Decrement previous node type count
        nodes[previousNodeType].count--;
        // Assign node ownership for node type to user
        nodeOwnership[msg.sender] = upgradeNodeType;
        // Transfer threshold tokens to contract
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                tokenRequirement
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Emit upgrade user node event
        emit LogUpgradeUserNode(
            id,
            previousNodeType,
            upgradeNodeType
        );
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
        nodeOwnership[msg.sender] = 0;
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
        emit LogDestroyUserNode(
            id,
            msg.sender
        );
        return true;
    }

    /**
    * Adds a new node
    * @param name Name of node
    * @param tokenThreshold Minimum of tokens required to be held before node can be activated
    * @param timeThreshold Minimum time tokens need to be held before node can be activated
    * @param maxCount Maximum number of nodes of this type that can be active at a time
    * @param rewards Array of reward IDs linked to this node type
    * @param entryFeeDiscount Entry fee discount
    * @param increasedPrizePayout % increment on prizes won from quests by node holders
    * @return Whether node was added
    */
    function addNode(
        string memory name,
        uint256 tokenThreshold,
        uint256 timeThreshold,
        uint256 maxCount,
        uint8[] memory rewards,
        uint256 entryFeeDiscount,
        uint256 increasedPrizePayout
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
        // Entry fee discount must be between 0 and 100
        require(
            entryFeeDiscount <= 100 &&
            entryFeeDiscount > 0,
            "INVALID_ENTRY_FEE_DISCOUNT"
        );
        // Increased prize payout must be between 0 and 100
        require(
            increasedPrizePayout <= 100 &&
            increasedPrizePayout > 0,
            "INVALID_INCREASED_PRIZE_PAYOUT"
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
        // Add node type - Node types would start with 1-index
        nodes[++nodeCount] = Node({
            name: name,
            tokenThreshold: tokenThreshold,
            timeThreshold: timeThreshold,
            maxCount: maxCount,
            rewards: rewards,
            entryFeeDiscount: entryFeeDiscount,
            increasedPrizePayout: increasedPrizePayout,
            count: 0
        });
        emit LogNewNode(nodeCount);
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
    * Returns node owner for a given node ID
    * @param userNodeId Unique user node ID
    * @return Returns owner address of a node
    */
    function getNodeOwner(
        uint256 userNodeId
    )
    public
    view
    returns (address) {
        return userNodes[userNodeId].owner;
    }

    /**
    * Returns whether a node has quest rewards
    * @param userNodeId Unique user node ID
    * @return Whether node has quest rewards
    */
    function isQuestNode(
        uint256 userNodeId
    )
    public
    view
    returns (bool) {
        bool _isQuestNode = false;
        for (uint256 i = 0; i < nodes[userNodes[userNodeId].node].rewards.length; i++) {
            if (nodes[userNodes[userNodeId].node].rewards[i] == uint8(Rewards.CREATE_QUEST))
                _isQuestNode = true;
        }
        return _isQuestNode;
    }

    /**
    * Returns whether a node has tournament rewards
    * @param userNodeId Unique user node ID
    * @return Whether node has tournament rewards
    */
    function isTournamentNode(
        uint256 userNodeId
    )
    public
    view
    returns (bool) {
        bool _isTournamentNode = false;
        for (uint256 i = 0; i < nodes[userNodes[userNodeId].node].rewards.length; i++) {
            if (nodes[userNodes[userNodeId].node].rewards[i] == uint8(Rewards.CREATE_TOURNAMENT))
                _isTournamentNode = true;
        }
        return _isTournamentNode;
    }

    /**
    * Returns whether a node has increased prize payout rewards
    * @param userNodeId Unique user node ID
    * @return Whether node has increased prize payout rewards
    */
    function isIncreasedPrizePayoutNode(
        uint256 userNodeId
    )
    public
    view
    returns (bool) {
        bool _isIncreasedPrizePayoutNode = false;
        for (uint256 i = 0; i < nodes[userNodes[userNodeId].node].rewards.length; i++) {
            if (nodes[userNodes[userNodeId].node].rewards[i] == uint8(Rewards.INCREASED_PRIZE_PAYOUTS))
                _isIncreasedPrizePayoutNode = true;
        }
        return _isIncreasedPrizePayoutNode;
    }

}