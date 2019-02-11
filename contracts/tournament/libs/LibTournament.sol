pragma solidity 0.5.0;

contract LibTournament {

    struct Tournament {
        // Entry fee
        uint256 entryFee;
        // Maximum participants
        uint256 maxParticipants;
        // Unique id of prize table
        bytes32 prizeTable;
        // Participants in tournament
        mapping (address => bool) participants;
        // Final standings
        address[] finalStandings;
        // Claimed amounts from participants based on prize table and final standings
        mapping (address => bool) claimed;
    }

}
