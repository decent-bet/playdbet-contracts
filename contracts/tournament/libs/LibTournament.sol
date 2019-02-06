pragma solidity 0.5.0;

contract LibTournament {

    struct Tournament {
        // Entry fee
        uint256 entryFee;
        // Unique id of prize table
        bytes32 prizeTable;
        // Participants in tournament
        address[] participants;
        // Final standings
        address[] finalStandings;
    }

}
