pragma solidity 0.5.8;

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
        // Was the quest added by a node
        bool isNode;
        // Unique node ID
        uint256 nodeId;
        // Amount to pay in DBETs for quest entry
        uint256 entryFee;
        // Prize in DBETs to payout to winners
        uint256 prize;
        // Quest status
        uint8 status;
        // Maximum number of quest entries - ignored if set at 0
        uint256 maxEntries;
        // Number of quest entries
        uint256 count;
    }

    struct UserQuestEntry {
        // Entry time
        uint256 entryTime;
        // Entry fee - can vary based on whether user has an active node at time of entering a quest
        uint256 entryFee;
        // Quest entry status
        uint8 status;
        // True if user claims refund for a cancelled quest
        bool refunded;
    }

}
