pragma solidity 0.5.0;

contract LibQuest {

    // Possible quest statuses
    enum QuestStatus {
        INACTIVE,
        ACTIVE,
        CANCELLED
    }

    // Possible quest statuses for user entries
    enum QuestEntryStatus {
        NOT_STARTED,
        STARTED,
        SUCCESS,
        FAILED,
        CANCELLED
    }

    struct Quest {
        // Amount to pay in DBETs for quest entry
        uint256 entryFee;
        // Maximum time for user to complete quest
        uint256 timeToComplete;
        // Prize in DBETs to payout to winners
        uint256 prize;
        // Quest status
        uint8 status;
    }

    struct UserQuestEntry {
        // Entry time
        uint256 entryTime;
        // Quest entry status
        uint8 status;
        // True if user claims refund for a cancelled quest
        bool refunded;
    }

}
