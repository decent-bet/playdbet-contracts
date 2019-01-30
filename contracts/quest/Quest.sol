pragma solidity 0.5.0;

import "./interfaces/IQuest.sol";
import "./libs/LibQuest.sol";

contract Quest is
IQuest,
LibQuest {

    // Owner of Quest contract
    address public owner;
    // Admins mapping
    mapping (address => bool) public admins;
    // Quests mapping

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
        address _owner
    ) {
        owner = _owner;
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

    }

    /**
    * Pays for a quest as a user
    * @param id Unique quest ID
    * @return Whether the quest was paid for
    */
    function payForQuest(
        bytes32 id
    ) public returns (bool) {

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
