pragma solidity 0.5.0;

contract IQuest {

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
    ) public returns (bool);

    /**
    * Pays for a users' quest
    * @param id Unique quest ID
    * @param user User entering a quest
    * @return Whether the quest was paid for
    */
    function payForQuest(
        bytes32 id,
        address user
    ) public returns (bool);

    /**
    * Allows the platform to set the quest outcome for a user playing a quest and payout user/Decent.bet
    * @param id Unique quest ID
    * @param user User playing quest
    * @param outcome Final quest entry status
    * @return Whether quest outcome was set
    */
    function setQuestOutcome(
        bytes32 id,
        address user,
        uint8 outcome
    ) public returns (bool);

}
