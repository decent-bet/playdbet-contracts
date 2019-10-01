pragma solidity 0.5.8;

import "./interfaces/IQuest.sol";
import "./libs/LibQuest.sol";

import "../admin/Admin.sol";
import "../token/ERC20.sol";
import "../node/DBETNode.sol";
import "../node/NodeWallet.sol";

import "../utils/SafeMath.sol";

contract Quest is
IQuest,
LibQuest {

    using SafeMath for uint256;

    // Owner of Quest contract
    address public owner;
    // DBET Token
    ERC20 public token;
    // Admin contract
    Admin public admin;
    // DBETNode contract
    DBETNode public dbetNode;
    // Quests mapping
    mapping (bytes32 => Quest) public quests;
    // User quest entries mapping
    mapping (address => mapping (bytes32 => mapping (uint256 => UserQuestEntry))) public userQuestEntries;
    // User quest entry count
    mapping (address => mapping (bytes32 => uint256)) public userQuestEntryCount;

    // On add new quest
    event LogNewQuest(
        bytes32 indexed id
    );
    // On cancel quest
    event LogCancelQuest(
        bytes32 indexed id
    );
    // On cancel quest entry
    event LogCancelQuestEntry(
        bytes32 indexed id,
        address indexed user,
        uint256 questEntryCount
    );
    // On pay for quest
    event LogPayForQuest(
        bytes32 indexed id,
        address indexed user,
        address indexed payer,
        uint256 questEntryCount
    );
    // On set quest outcome
    event LogSetQuestOutcome(
        bytes32 indexed id,
        address indexed user,
        uint256 questEntryCount
    );
    // On refund user
    event LogRefundQuestEntry(
        bytes32 indexed id,
        address indexed user,
        bool isQuestCancelled,
        uint256 questEntryCount
    );

    constructor (
        address _admin,
        address _token,
        address _dbetNode
    )
    public {
        require(_token != address(0));
        owner = msg.sender;
        token = ERC20(_token);
        admin = Admin(_admin);
        dbetNode = DBETNode(_dbetNode);
    }

    /**
    * Allows an admin to add a quest
    * @param id Unique quest ID
    * @param entryFee Amount to pay in DBETs for quest entry
    * @param prize Prize in DBETs to payout to winners
    * @return Whether the quest was added
    */
    function addQuest(
        bytes32 id,
        uint256 entryFee,
        uint256 prize
    )
    public
    returns (bool) {
        // Allow only admins to add quests
        require(admin.admins(msg.sender), "INVALID_ADMIN_SENDER_STATUS");
        // Id cannot be default bytes32 value and cannot already exist on-chain
        require(
            id != 0 &&
            quests[id].status == uint8(QuestStatus.INACTIVE),
            "INVALID_QUEST_DETAILS"
        );
        // Check if uints are greater than 0
        require(
            entryFee > 0 &&
            prize > 0,
            "INVALID_QUEST_DETAILS"
        );
        // Add quest to contract
        quests[id] = Quest({
            isNode: false,
            nodeId: 0,
            entryFee: entryFee,
            prize: prize,
            status: uint8(QuestStatus.ACTIVE),
            maxEntries: 0,
            count: 0
        });
        // Emit new quest event
        emit LogNewQuest(
            id
        );
        return true;
    }

    /**
    * Allows nodes to add quests
    * @param nodeId Uniqe node ID in DBETNode contract
    * @param id Unique quest ID
    * @param entryFee Amount to pay in DBETs for quest entry
    * @param prize Prize in DBETs to payout to winners
    * @param maxEntries Maximum entries for this quest
    * @return Whether the quest was added
    */
    function addNodeQuest(
        uint256 nodeId,
        bytes32 id,
        uint256 entryFee,
        uint256 prize,
        uint256 maxEntries
    )
    public
    returns (bool) {
        // Allow only active node holders to add quests
        require(
            isActiveNode(
                nodeId,
                msg.sender
            ),
            "INVALID_NODE"
        );
        // Id cannot be default bytes32 value and cannot already exist on-chain
        require(
            id != 0 &&
            quests[id].status == uint8(QuestStatus.INACTIVE),
            "INVALID_QUEST_DETAILS"
        );
        // Check if uints are greater than 0
        require(
            entryFee > 0 &&
            prize > 0 &&
            maxEntries >= 0,
            "INVALID_QUEST_DETAILS"
        );
        // Check if user has set an allowance of `maxEntries * prize` DBETs for this contract
        require(
            token.allowance(
                msg.sender,
                address(this),
                maxEntries.mul(prize)
            ),
            "INVALID_TOKEN_ALLOWANCE"
        );
        // Add quest to contract
        quests[id] = Quest({
            isNode: true,
            nodeId: nodeId,
            entryFee: entryFee,
            prize: prize,
            status: uint8(QuestStatus.ACTIVE),
            maxEntries: maxEntries,
            count: 0
        });
        // Transfer `maxEntries * prize` DBETs to NodeWallet
        require(
            token.transferFrom(
                msg.sender,
                dbetNode.nodeWallet,
                maxEntries.mul(prize)
            ),
            "ERROR_TOKEN_TRANSFER"
        );
        // Set prize fund for node quest in NodeWallet
        require(
            NodeWallet(dbetNode.nodeWallet).setPrizeFund(
                nodeId,
                id,
                maxEntries.mul(prize)
            ),
            "ERROR_SET_PRIZE_FUND"
        );
        // Emit new quest event
        emit LogNewQuest(
            id
        );
        return true;
    }

    /**
    * Pays for a users' quest
    * @param id Unique quest ID
    * @param user User entering a quest
    * @return Whether the quest was paid for
    */
    function payForQuest(
        bytes32 id,
        address user
    ) public returns (bool) {
        // Must be a valid quest ID
        require(quests[id].status == uint8(QuestStatus.ACTIVE), "INVALID_QUEST_ID");
        // Balance of user must be greater or equal to quest entry fee
        require(
            (
                token.balanceOf(msg.sender) >=
                quests[id].entryFee
            ) &&
            (
                token.allowance(
                    msg.sender,
                    address(this)
                ) >=
                quests[id].entryFee
            ),
            "INVALID_TOKEN_BALANCE_ALLOWANCE"
        );
        uint256 _userQuestEntryCount = userQuestEntryCount[user][id];
        // Previous user quest entry must be NOT_STARTED
        require(
            userQuestEntries[user][id][_userQuestEntryCount].status == uint8(QuestEntryStatus.NOT_STARTED),
            "INVALID_PREVIOUS_QUEST_ENTRY_STATUS"
        );
        // Add user quest entry
        userQuestEntries[user][id][_userQuestEntryCount] = UserQuestEntry({
            entryTime: block.timestamp,
            status: uint8(QuestEntryStatus.STARTED),
            refunded: false
        });
        // Increment quest count
        quests[id].count++;
        // Transfer entry fee to platform wallet
        if (quests[id].isNode) {
            // Check if node is active
            require(
                isActiveNode(
                    quests[id].nodeId,
                    dbetNode.getNodeOwner(quests[id].nodeId)
                ),
                "INVALID_QUEST_NODE_STATUS"
            );
            // Check if max entries exceeded
            require(
                quests[id].count <= quests[id].maxEntries,
                "MAX_ENTRIES_EXCEEDED"
            );
            // Transfer entry fee to node owner
            require(
                token.transferFrom(
                    msg.sender,
                    dbetNode.nodeWallet,
                    quests[id].entryFee
                ),
                "ERROR_TOKEN_TRANSFER"
            );
            // Add to quest entry fees in node wallet
            require(
                NodeWallet(dbetNode.nodeWallet)
                    .addQuestEntryFee(
                        quests[id].nodeId,
                        id,
                        quests[id].entryFee
                    )
                ,
                "ERROR_NODE_WALLET_ADD_QUEST_ENTRY_FEE"
            );
        } else
            // Transfer entry fees to platform wallet
            require(
                token.transferFrom(
                    msg.sender,
                    admin.platformWallet(),
                    quests[id].entryFee
                ),
                "ERROR_TOKEN_TRANSFER"
            );
        // Emit log pay for quest event
        emit LogPayForQuest(
            id,
            user,
            msg.sender,
            _userQuestEntryCount
        );
    }

    /**
    * Allows the platform to set the quest outcome for a user playing a quest and pays out the user/Decent.bet
    * @param id Unique quest ID
    * @param user User playing quest
    * @return Whether quest outcome was set
    */
    function setQuestOutcome(
        bytes32 id,
        address user,
        uint8 outcome
    ) public returns (bool) {
        // Allow only admins to set quest outcomes
        require(admin.admins(msg.sender), "INVALID_SENDER_ADMIN_STATUS");
        uint256 _userQuestEntryCount = userQuestEntryCount[user][id];
        // User quest entry status must be STARTED
        require(
            userQuestEntries[user][id][_userQuestEntryCount].status == uint8(QuestEntryStatus.STARTED),
            "INVALID_USER_QUEST_ENTRY_STATUS"
        );
        // Must be a valid outcome
        require(
            outcome == uint8(QuestEntryStatus.SUCCESS) ||
            outcome == uint8(QuestEntryStatus.FAILED),
            "INVALID_OUTCOME"
        );
        // Update quest entry status
        userQuestEntries[user][id][_userQuestEntryCount].status = outcome;
        // Increment user quest entry count
        userQuestEntryCount[user][id] += 1;
        // Pay out user if quest was successfully finished
        if(outcome == uint8(QuestEntryStatus.SUCCESS)) {
            if (quests[id].isNode) {
                // Transfer out DBETs escrowed within node wallet to user
                require(
                    token.transferFrom(
                        dbetNode.nodeWallet,
                        user,
                        quests[id].prize
                    ),
                    "ERROR_TOKEN_TRANSFER"
                );
                // Record prize distribution for successfully completing a quest
                require(
                    NodeWallet(dbetNode.nodeWallet)
                        .completeQuest(
                            quests[id].nodeId,
                            id,
                            quests[id].entryFee
                        ),
                    "ERROR_NODE_WALLET_COMPLETE_QUEST"
                );
            } else
                require(
                    token.transferFrom(
                        admin.platformWallet(),
                        user,
                        quests[id].prize
                    ),
                    "ERROR_TOKEN_TRANSFER"
                );
        }
        emit LogSetQuestOutcome(
            id,
            user,
            _userQuestEntryCount
        );
    }

    /**
    * Allows admins to cancel quests
    * @param id Unique quest ID
    * @return whether quest was cancelled
    */
    function cancelQuest(
        bytes32 id
    )
    public
    returns (bool) {
        // Allow only admins to cancel quests
        require(admin.admins(msg.sender), "INVALID_SENDER_ADMIN_STATUS");
        // Quest must be active
        require(quests[id].status == uint8(QuestStatus.ACTIVE), "INVALID_QUEST_STATUS");
        // Cancel quest
        quests[id].status = uint8(QuestStatus.CANCELLED);
        // Emit cancel quest event
        emit LogCancelQuest(
            id
        );
    }

    /**
    * Cancels an individual quest entry
    * @param id Unique quest ID
    * @param user Address of user
    * @return whether quest entry was cancelled
    */
    function cancelQuestEntry(
        bytes32 id,
        address user
    )
    public
    returns (bool) {
        // Allow only admins to cancel quests
        require(admin.admins(msg.sender), "INVALID_SENDER_ADMIN_STATUS");
        // Quest must be active
        require(quests[id].status == uint8(QuestStatus.ACTIVE), "INVALID_QUEST_STATUS");
        uint256 _userQuestEntryCount = userQuestEntryCount[user][id];
        // Quest entry must be started
        require(
            userQuestEntries[user][id][_userQuestEntryCount].status == uint8(QuestEntryStatus.STARTED),
            "INVALID_USER_QUEST_ENTRY_STATUS"
        );
        // Switch quest entry status to cancelled
        userQuestEntries[user][id][_userQuestEntryCount].status = uint8(QuestEntryStatus.CANCELLED);
        // Claim refund for the quest entry
        claimRefundForEntry(
            id,
            user
        );
        // Emit log cancel quest entry event
        emit LogCancelQuestEntry(
            id,
            user,
            _userQuestEntryCount
        );
    }

    /**
    * Allow users with quest entries to claim refunds for cancelled quests
    * @param id Cancelled quest ID
    * @return whether refunds were claimed
    */
    function claimRefund(
        bytes32 id,
        address user
    )
    public
    returns (bool) {
        require(
            admin.admins(msg.sender) ||
            msg.sender == user,
            "INVALID_MSG_SENDER"
        );
        uint256 _userQuestEntryCount = userQuestEntryCount[user][id];
        // Quest entry must be started
        require(
            userQuestEntries[user][id][_userQuestEntryCount].status == uint8(QuestEntryStatus.STARTED),
            "INVALID_USER_QUEST_ENTRY_STATUS"
        );
        // Quest should be cancelled
        require(
            quests[id].status == uint8(QuestStatus.CANCELLED),
            "INVALID_QUEST_STATUS"
        );
        // User quest entry cannot already be refunded
        require(
            !userQuestEntries[user][id][_userQuestEntryCount].refunded,
            "INVALID_USER_QUEST_REFUNDED_STATUS"
        );
        userQuestEntries[user][id][_userQuestEntryCount].refunded = true;
        // Increment user quest entry count
        userQuestEntryCount[user][id] += 1;
        // Transfer entryFee to user
        if (quests[id].isNode) {
            // Transfer out DBETs escrowed within node wallet to user
            require(
                token.transferFrom(
                    dbetNode.nodeWallet,
                    user,
                    quests[id].entryFee
                ),
                "ERROR_TOKEN_TRANSFER"
            );
            // Remove entry fee from node wallet quest fee records
            require(
                NodeWallet(dbetNode.nodeWallet)
                .claimRefund(
                    quests[id].nodeId,
                    id,
                    quests[id].entryFee
                ),
                "ERROR_NODE_WALLET_CLAIM_REFUND"
            );
        } else
            require(
                token.transferFrom(
                    admin.platformWallet(),
                    user,
                    quests[id].entryFee
                ),
                "ERROR_TOKEN_TRANSFER"
            );
        // Emit log refund quest entry event
        emit LogRefundQuestEntry(
            id,
            user,
            true,
            _userQuestEntryCount
        );
    }

    /**
    * Allows user to claim refunds for cancelled quest entries
    * @param id Unique quest id
    * @return whether refunds were claimed
    */
    function claimRefundForEntry(
        bytes32 id,
        address user
    )
    public
    returns (bool) {
        require(
            admin.admins(msg.sender) ||
            msg.sender == user,
            "INVALID_MSG_SENDER"
        );
        uint256 _userQuestEntryCount = userQuestEntryCount[user][id];
        // Quest entry must be cancelled
        require(
            userQuestEntries[user][id][_userQuestEntryCount].status == uint8(QuestEntryStatus.CANCELLED),
            "INVALID_USER_QUEST_ENTRY_STATUS"
        );
        // User quest entry cannot already be refunded
        require(
            !userQuestEntries[user][id][_userQuestEntryCount].refunded,
            "INVALID_USER_QUEST_REFUNDED_STATUS"
        );
        userQuestEntries[user][id][_userQuestEntryCount].refunded = true;
        // Increment user quest entry count
        userQuestEntryCount[user][id] += 1;
        // Transfer entryFee to user
        if (quests[id].isNode) {
            // Transfer out DBETs escrowed within node wallet to user
            require(
                token.transferFrom(
                    dbetNode.nodeWallet,
                    user,
                    quests[id].entryFee
                ),
                "ERROR_TOKEN_TRANSFER"
            );
            // Remove entry fee from node wallet quest fee records
            require(
                NodeWallet(dbetNode.nodeWallet)
                .claimRefund(
                    quests[id].nodeId,
                    id,
                    quests[id].entryFee
                ),
                "ERROR_NODE_WALLET_CLAIM_REFUND"
            );
        } else
            require(
                token.transferFrom(
                    admin.platformWallet(),
                    user,
                    quests[id].entryFee
                ),
                "ERROR_TOKEN_TRANSFER"
            );
        // Emit log refund quest entry event
        emit LogRefundQuestEntry(
            id,
            user,
            false,
            _userQuestEntryCount
        );
    }

    /**
    * Returns whether an input node ID and owner is valid and active
    * @param id Unique node ID
    * @param owner Address of node owner
    * @return Whether node is active
    */
    function isActiveNode(
        uint256 id,
        address owner
    )
    public
    view
    returns (bool) {
        return (
            dbetNode.isUserNodeActivated(id) &&
            dbetNode.isUserNodeOwner(
                owner,
                id
            )
        );
    }

}
