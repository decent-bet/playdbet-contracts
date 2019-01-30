pragma solidity 0.5.0;

contract LibQuest {

    // Possible quest statuses for user entries
    enum QuestStatus {
        STARTED,
        SUCCESS,
        FAILED
    }

    struct Quest {
        // Amount to pay in DBETs for quest entry
        uint256 entryFee;
        // Maximum time for user to complete quest
        uint256 timeToComplete;
        // Prize in DBETs to payout to winners
        uint256 prize;
        // True if quest has been set
        bool exists;
    }

    struct UserQuestEntry {
        // Entry time
        uint256 entryTime;
        // Quest status
        uint8 status;
        // True if entry has been added
        bool exists;
    }

}
