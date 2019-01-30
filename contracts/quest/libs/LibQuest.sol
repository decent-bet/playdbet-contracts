pragma solidity 0.5.0;

contract LibQuest {

    struct Quest {
        // Unique quest id
        bytes32 id;
        // Amount to pay in DBETs for quest entry
        uint256 entryFee;
        // Maximum time for user to complete quest
        uint256 timeToComplete;
        // Prize in DBETs to payout to winners
        uint256 prize;
    }

}
