pragma solidity 0.5.0;

import "./interfaces/ITournament.sol";
import "./libs/LibTournament.sol";

import "../admin/Admin.sol";

import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract Tournament is
ITournament,
LibTournament {

    using SafeMath for uint256;

    // Owner of the tournament contract
    address public owner;
    // Admin contract
    Admin public admin;
    // Token contract
    ERC20 public token;

    // Prize table mapping
    mapping (bytes32 => uint256[]) prizeTables;
    // Tournaments mapping
    mapping (bytes32 => Tournament) tournaments;
    // Prize table count
    uint256 public prizeTableCount;
    // Tournament count
    uint256 public tournamentCount;

    // Log new prize table
    event LogNewPrizeTable(
        bytes32 indexed id,
        uint256 indexed count
    );
    // Log new tournament
    event LogNewTournament(
        bytes32 indexed id,
        uint256 indexed count
    );
    // Log entered tournament
    event LogEnteredTournament(
        bytes32 indexed id,
        address indexed participant
    );
    // Log completed tournament
    event LogCompletedTournament(
        bytes32 indexed id
    );
    // Log claimed tournament prize
    event LogClaimedTournamentPrize(
        bytes32 indexed id,
        address participant,
        uint256 standing,
        uint256 prize
    );

    constructor (
        address _admin,
        address _token
    )
    public {
        owner = msg.sender;
        admin = Admin(_admin);
        token = ERC20(_token);
    }

    /**
    * Creates a prize table that can be used for a tournament
    * @param table array of integers representing redeemable prize money for each position represented by indices in the array
    * @return unique ID of the prize table
    */
    function createPrizeTable(
        uint256[] memory table
    ) public returns (bytes32) {
        // Sender must be an admin
        require(
            admin.admins(msg.sender),
            "INVALID_SENDER"
        );
        // Prize table must have more than one prize value
        require(
            table.length > 0,
            "INVALID_PRIZE_TABLE"
        );
        uint256 totalPrizePercent = 0;
        for (uint256 i = 0; i < table.length; i++) {
            totalPrizePercent = totalPrizePercent.add(table[i]);
        }
        // Total percentage of prizes in prize table must be 100
        require(
            totalPrizePercent == 100,
            "INVALID_PRIZE_PERCENT_TOTAL"
        );
        bytes32 id = keccak256(
            abi.encode(
                "prize_table_",
                prizeTableCount
            )
        );
        prizeTables[id] = table;
        emit LogNewPrizeTable(
            id,
            prizeTableCount++
        );
    }

    /**
    * Creates a tournament that users can enter
    * @param entryFee fee to enter the tournament
    * @param isMultiEntry can a user enter more than once
    * @param minEntries the minimum number of entries for the tournament
    * @param maxEntries the maximum number of entries for the tournament
    * @param rakePercent percentage of the prize pool retained by Decent.bet
    * @param prizeTable unique ID of prize table to be used for the tournament
    * @return unique ID of the created tournament
    */
    function createTournament(
        uint256 entryFee,
        bool isMultiEntry,
        uint256 minEntries,
        uint256 maxEntries,
        uint256 rakePercent,
        bytes32 prizeTable
    ) public returns (bytes32) {
        // Creator must be an admin
        require(
            admin.admins(msg.sender),
            "INVALID_SENDER"
        );
        // Entry fee must be greater than 0
        require(
            entryFee > 0,
            "INVALID_ENTRY_FEE"
        );
        // Min entries must be greater than 0 and less than or equal to max entries
        require(
            minEntries > 0 &&
            minEntries <= maxEntries,
            "INVALID_ENTRIES_RANGE"
        );
        // Rake percent must be greater than 0 and less than 100
        require(
            rakePercent > 0 &&
            rakePercent < 100,
            "INVALID_RAKE_PERCENT"
        );
        // Must be a valid prize table
        require(prizeTables[prizeTable][0] != 0);
        bytes32 id = keccak256(
            abi.encode(
                "tournament_",
                entryFee,
                isMultiEntry,
                minEntries,
                maxEntries,
                rakePercent,
                tournamentCount
            )
        );
        address[] memory finalStandings;
        address[] memory entries;
        tournaments[id] = Tournament({
            entryFee: entryFee,
            isMultiEntry: isMultiEntry,
            minEntries: minEntries,
            maxEntries: maxEntries,
            prizeTable: prizeTable,
            entries: entries,
            finalStandings: finalStandings
        });
        emit LogNewTournament(
            id,
            tournamentCount++
        );
    }

    /**
    * Allows users to enter a tournament by paying the listed entry fee
    * @param id unique ID of the tournament
    */
    function enterTournament(
        bytes32 id
    ) public returns (bool) {
        // Must be a valid tournament
        require(
            tournaments[id].entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Cannot have already entered the tournament if isMultiEntry is false
        if(!tournaments[id].isMultiEntry)
            for (uint256 i = 0; i < tournaments[id].entries.length; i++) {
                require(
                    tournaments[id].entries[i] != msg.sender,
                    "ENTRY_STATUS_ENTERED"
                );
            }
        // Tournament cannot have been completed
        require(
            tournaments[id].finalStandings.length == 0,
            "TOURNAMENT_STATUS_COMPLETED"
        );
        // Cannot be over max entry count
        require(
            tournaments[id].entries.length !=
            tournaments[id].maxEntries,
            "MAX_ENTRY_COUNT_EXCEEDED"
        );
        // Must have a balance and allowance >= entryFee
        require(
            token.balanceOf(msg.sender) >= tournaments[id].entryFee &&
            token.allowance(msg.sender, address(this)) >= tournaments[id].entryFee,
            "INVALID_TOKEN_BALANCE_OR_ALLOWANCE"
        );
        // Transfer tokens to contract
        require(
            token.transferFrom(msg.sender, address(this), tournaments[id].entryFee),
            "TOKEN_TRANSFER_ERROR"
        );
        // Add to tournament
        tournaments[id].entries.push(msg.sender);
        // Emit log entered tournament event
        emit LogEnteredTournament(
            id,
            msg.sender
        );
    }

    /**
    * Allows the admin to complete the tournament by publishing the final standings
    * @param id unique ID of the tournament
    * @param finalStandings final standings of participants in the tournament
    * @return whether the tournament was completed
    */
    function completeTournament(
        bytes32 id,
        address[] memory finalStandings
    ) public returns (bool) {
        // Sender must be an admin
        require(admin.admins(msg.sender));
        // Must be a valid tournament
        require(tournaments[id].entryFee != 0);
        // Must be a valid finalStandings length
        require(finalStandings.length > 0);
        // Tournament cannot have been completed
        require(tournaments[id].finalStandings.length == 0);
        // Set finalStandings for the tournament
        tournaments[id].finalStandings = finalStandings;
        // Emit log completed tournament event
        emit LogCompletedTournament(id);
    }

    /**
    * Allows users to claim their tournament prizes
    * @param id unique ID of the tournament
    * @param index final standing index in the tournaments' final standings
    * @return whether the tournament prize was claimed
    */
    function claimTournamentPrize(
        bytes32 id,
        uint256 index
    ) public returns (bool) {
        // Must be a valid tournament
        require(tournaments[id].entryFee != 0);
        // Tournament should have been completed
        require(tournaments[id].finalStandings.length > 0);
        // Address at final standings index must be sender
        require(tournaments[id].finalStandings[index] == msg.sender);
        // User cannot have already claimed their prize
        require(!tournaments[id].claimed[msg.sender]);
        // Prize table must have a valid prize at final standings index
        require(prizeTables[tournaments[id].prizeTable][index] != 0);
        // Transfer prize tokens to sender
        require(
            token.transfer(
                msg.sender,
                prizeTables[tournaments[id].prizeTable][index]
            )
        );
        // Mark prize as claimed
        tournaments[id].claimed[msg.sender] = true;
        // Emit log claimed tournament prize event
        emit LogClaimedTournamentPrize(
            id,
            msg.sender,
            index,
            prizeTables[tournaments[id].prizeTable][index]
        );
    }

}