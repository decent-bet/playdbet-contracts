pragma solidity 0.5.8;

contract LibTournament {

    enum TournamentStatus {
        ACTIVE,
        COMPLETED,
        FAILED
    }

    enum TournamentPrizeType {
        STANDARD,
        WINNER_TAKE_ALL,
        FIFTY_FIFTY
    }

    struct Tournament {
        // Was the quest added by a node
        bool isNode;
        // Unique node ID
        uint256 nodeId;
        // Tournament details
        TournamentDetails details;
        // Participants in tournament
        TournamentEntry[] entries;
        // Total entry fees for tournament
        uint256 totalEntryFees;
        // Prize table to entries array mapping
        mapping (uint256 => uint256[]) prizes;
        // Unique standings - used to determine number of unique final standings excluding tied entries for prize giveaway calculation.
        // If unique final standings < prize table length, the remaining prize table % will be equally distributed among all addresses
        uint256 uniqueFinalStandings;
        // Claimed amounts from entries => finalStandingIndex based on prize table and final standings
        mapping (uint256 => mapping(uint256 => bool)) claimed;
        // Refunded amounts from entries for tournaments with a failed status
        mapping (uint256 => bool) refunded;
        // Tournament status based on enum
        uint8 status;
    }

    struct TournamentDetails {
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
        // Prize type
        uint8 prizeType;
        // Unique id of prize table
        bytes32 prizeTable;
    }

    struct TournamentEntry {
        // Address of entered user
        address _address;
        // Entry fee paid
        uint256 entryFee;
        // Final standing index
        uint256[] finalStandings;
    }

}
