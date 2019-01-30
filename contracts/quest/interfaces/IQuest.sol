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
    * Pays for a quest as a user
    * @param id Unique quest ID
    * @return Whether the quest was paid for
    */
    function payForQuest(
        bytes32 id
    ) public returns (bool);

    /**
    * Allows the platform to set the quest outcome for a user playing a quest
    * @param id Unique quest ID
    * @param user User playing quest
    * @return Whether quest outcome was set
    */
    function setQuestOutcome(
        bytes32 id,
        address user
    ) public returns (bool);

    /**
    * Allows users who've completed quests to claim their quest payout
    * @param id Unique quest ID
    * @return Whether the quest payout was claimed
    */
    function claimQuestPayout(
        bytes32 id
    ) public returns (bool);

    /**
    * Adds an admin to the Quest contract
    * @param _address Address to add as admin
    * @return whether admin was added
    */
    function addAdmin(
        address _address
    ) public returns (bool);

    /**
    * Removes an admin from the Quest contract
    * @param _address Address of admin
    * @return whether admin was removed
    */
    function removeAdmin(
        address _address
    ) public returns (bool);

}
