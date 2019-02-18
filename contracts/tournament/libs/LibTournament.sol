pragma solidity 0.5.0;

contract LibTournament {

    enum TournamentStatus {
        ACTIVE,
        COMPLETED,
        FAILED
    }

    struct Tournament {
        // Entry fee
        uint256 entryFee;
        // How many times can a user enter the tournament
        uint256 entryLimit;
        // Minimum entries
        uint256 minEntries;
        // Maximum entries
        uint256 maxEntries;
        // Rake percent
        uint256 rakePercent;
        // Unique id of prize table
        bytes32 prizeTable;
        // Participants in tournament
        address[] entries;
        // Final standings
        uint256[] finalStandings;
        // Claimed amounts from entries based on prize table and final standings
        mapping (uint256 => bool) claimed;
        // Refunded amounts from entries for tournaments with a failed status
        mapping (uint256 => bool) refunded;
        // Tournament status based on enum
        uint8 status;
    }

}
