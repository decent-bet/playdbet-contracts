pragma solidity 0.5.0;

contract LibTournament {

    struct Tournament {
        // Entry fee
        uint256 entryFee;
        // Can users enter multiple times
        bool isMultiEntry;
        // Maximum entries
        uint256 maxEntries;
        // Unique id of prize table
        bytes32 prizeTable;
        // Participants in tournament
        address[] entries;
        // Final standings
        address[] finalStandings;
        // Claimed amounts from participants based on prize table and final standings
        mapping (address => bool) claimed;
    }

}
