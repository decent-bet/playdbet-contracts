pragma solidity 0.5.0;

import "./interfaces/IQuest.sol";
import "./libs/LibQuest.sol";

import "../token/ERC20.sol";

contract Quest is
IQuest,
LibQuest {

    // Owner of Quest contract
    address public owner;
    // Admins mapping
    mapping (address => bool) public admins;
    // Quests mapping
    mapping (bytes32 => Quest) public quests;
    // User quest entries mapping
    mapping (address => mapping (bytes32 => UserQuestEntry)) userQuestEntries;

    // On add admin event
    event LogAddAdmin(
        address indexed _address
    );
    // On remove admin event
    event LogRemoveAdmin(
        address indexed _address
    );
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

    constructor(
        address token
    ) {
        require(token != address(0));
        owner = msg.sender;
        token = ERC20(token);
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
        require(admins[msg.sender]);
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
            token.balanceOf(msg.sender) >=
            quests[id].entryFee
        );
        // User cannot have already started quest
        require(
            !userQuestEntries[msg.sender][id].exists
        );
        // Add user quest entry
        userQuestEntries[msg.sender][id] = UserQuestEntry({
            entryTime: block.timestamp,
            status: QuestStatus.STARTED,
            exists: true
        });
        // Emit log pay for quest event
        emit LogPayForQuest(
            id,
            msg.sender
        );
    }

    /**
    * Allows the platform to set the quest outcome for a user playing a quest
    * @param id Unique quest ID
    * @param user User playing quest
    * @return Whether quest outcome was set
    */
    function setQuestOutcome(
        bytes32 id,
        address user
    ) public returns (bool) {

    }

    /**
    * Adds an admin to the market contract
    * @param _address Address to add as admin
    * @return whether admin was added
    */
    function addAdmin(
        address _address
    )
    public
    returns (bool) {
        require(msg.sender == owner);
        admins[_address] = true;
        emit LogAddAdmin(_address);
    }

    /**
    * Removes an admin from the market contract
    * @param _address Address of admin
    * @return whether admin was removed
    */
    function removeAdmin(
        address _address
    )
    public
    returns (bool) {
        require(msg.sender == owner);
        admins[_address] = false;
        emit LogRemoveAdmin(_address);
    }

}
