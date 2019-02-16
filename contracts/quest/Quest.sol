pragma solidity 0.5.0;

import "./interfaces/IQuest.sol";
import "./libs/LibQuest.sol";

import "../admin/Admin.sol";

import "../token/ERC20.sol";

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
    // Quests mapping
    mapping (bytes32 => Quest) public quests;
    // User quest entries mapping
    mapping (address => mapping (bytes32 => UserQuestEntry)) public userQuestEntries;

    // On add new quest
    event LogNewQuest(
        bytes32 indexed id
    );
    // On pay for quest
    event LogPayForQuest(
        bytes32 indexed id,
        address indexed user
    );
    // On set quest outcome
    event LogSetQuestOutcome(
        bytes32 indexed id,
        address indexed user
    );

    constructor (
        address _admin,
        address _token
    )
    public {
        require(_token != address(0));
        owner = msg.sender;
        token = ERC20(_token);
        admin = Admin(_admin);
    }

    /**
    * Allows an admin to add a quest
    * @param id Unique quest ID
    * @param entryFee Amount to pay in DBETs for quest entry
    * @param timeToComplete Maximum time for user to complete quest
    * @param prize Prize in DBETs to payout to winners
    * @return Whether the quest was added
    */
    function addQuest(
        bytes32 id,
        uint256 entryFee,
        uint256 timeToComplete,
        uint256 prize
    )
    public
    returns (bool) {
        // Allow only admins to add quests
        require(admin.admins(msg.sender));
        // Id cannot be default bytes32 value and cannot already exist on-chain
        require(
            id != 0 &&
            !quests[id].exists
        );
        // Check if uints are greater than 0
        require(
            entryFee > 0 &&
            timeToComplete > 0 &&
            prize > 0
        );
        // Add quest to contract
        quests[id] = Quest({
            entryFee: entryFee,
            timeToComplete: timeToComplete,
            prize: prize,
            exists: true
        });
        // Emit new quest event
        emit LogNewQuest(
            id
        );
        return true;
    }

    /**
    * Pays for a quest as a user
    * @param id Unique quest ID
    * @return Whether the quest was paid for
    */
    function payForQuest(
        bytes32 id
    ) public returns (bool) {
        // Must be a valid quest ID
        require(quests[id].exists);
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
            )
        );
        // User cannot have already started quest
        require(
            !userQuestEntries[msg.sender][id].exists
        );
        // Add user quest entry
        userQuestEntries[msg.sender][id] = UserQuestEntry({
            entryTime: block.timestamp,
            status: uint8(QuestStatus.STARTED),
            exists: true
        });
        require(
            token.transferFrom(
                msg.sender,
                admin.platformWallet(),
                quests[id].entryFee
            )
        );
        // Emit log pay for quest event
        emit LogPayForQuest(
            id,
            msg.sender
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
        require(admin.admins(msg.sender));
        // User quest entry must exist
        require(
            userQuestEntries[user][id].exists
        );
        // Must be a valid outcome
        require(
            outcome == uint8(QuestStatus.SUCCESS) ||
            outcome == uint8(QuestStatus.FAILED)
        );
        // Outcome cannot be success if entry took longer than timeToComplete to complete
        if(outcome == uint8(QuestStatus.SUCCESS))
            require(
                (userQuestEntries[user][id].entryTime).add(quests[id].timeToComplete) >=
                block.timestamp
            );
        // User quest entry status must be started
        require(
            userQuestEntries[user][id].status == uint8(QuestStatus.STARTED)
        );
        // Update quest entry status
        userQuestEntries[user][id].status = outcome;
        // Pay out user if quest was successfully finished
        if(outcome == uint8(QuestStatus.SUCCESS))
            require(
                token.transferFrom(
                    admin.platformWallet(),
                    user,
                    quests[id].prize
                )
            );
        emit LogSetQuestOutcome(
            id,
            user
        );
    }

}
