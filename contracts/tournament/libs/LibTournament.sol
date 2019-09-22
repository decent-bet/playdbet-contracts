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
        // Tournament details
        TournamentDetails details;
        // Participants in tournament
        TournamentEntry[] entries;
        // Refunded amounts from entries for tournaments with a failed status
        mapping (uint256 => bool) refunded;
        // Tournament status based on enum
        uint8 status;
    }

    struct TournamentPrize {
        // Prize distribution for players - Final standing to entries array mapping
        mapping (uint256 => uint256[]) prizes;
        // Unique standings - used to determine number of unique final standings excluding tied entries for prize giveaway calculation.
        // If unique final standings < prize table length, the remaining prize table % will be equally distributed among all addresses
        uint256 uniqueFinalStandings;
        // Claimed amounts from entries => finalStandingIndex based on prize table and final standings
        mapping (uint256 => mapping(uint256 => bool)) claimed;
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
        // Unique id of pool prize table
        bytes32 poolPrizeTable;
        // Unique id of rake prize table
        bytes32 rakePrizeTable;
    }

    struct TournamentEntry {
        // Address of entered user
        address _address;
        // Final standing index
        uint256[] finalStandings;
        // House node final standing index
        uint256[] houseNodeFinalStandings;
    }

}
