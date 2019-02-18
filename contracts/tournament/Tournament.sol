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
        bytes32 indexed id,
        uint8 indexed status
    );
    // Log claimed tournament prize
    event LogClaimedTournamentPrize(
        bytes32 indexed id,
        uint256 entryIndex,
        uint256 finalStandingIndex,
        uint256 prize
    );
    // Log refunded tournament entry
    event LogRefundedTournamentEntry(
        bytes32 indexed id,
        uint256 entryIndex
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
    * @param table Array of integers representing redeemable prize money for each position represented by indices in the array
    * @return Unique ID of the prize table
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
    * @param entryFee Fee to enter the tournament
    * @param entryLimit Entry limit for each unique address
    * @param minEntries The minimum number of entries for the tournament
    * @param maxEntries The maximum number of entries for the tournament
    * @param rakePercent Percentage of the prize pool retained by Decent.bet
    * @param prizeTable Unique ID of prize table to be used for the tournament
    * @return Unique ID of the created tournament
    */
    function createTournament(
        uint256 entryFee,
        uint256 entryLimit,
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
        // Entry limit must be greater than 0
        require(
            entryLimit > 0,
            "INVALID_ENTRY_LIMIT"
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
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                tournamentCount
            )
        );

        // Assign params
        tournaments[id].entryFee = entryFee;
        tournaments[id].entryLimit = entryLimit;
        tournaments[id].minEntries = minEntries;
        tournaments[id].maxEntries = maxEntries;
        tournaments[id].prizeTable = prizeTable;
        tournaments[id].rakePercent = rakePercent;

        // Emit log new tournament event
        emit LogNewTournament(
            id,
            tournamentCount++
        );
    }

    /**
    * Allows users to enter a tournament by paying the listed entry fee
    * @param id Unique ID of the tournament
    */
    function enterTournament(
        bytes32 id
    ) public returns (bool) {
        // Must be a valid tournament
        require(
            tournaments[id].entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Cannot have already entered the tournament if entryLimit is false
        if(tournaments[id].entryLimit > 1) {
            uint256 entryCount = 0;
            for (uint256 i = 0; i < tournaments[id].entries.length; i++) {
                if(tournaments[id].entries[i] == msg.sender) {
                    require(
                        ++entryCount <= tournaments[id].entryLimit,
                        "ENTRY_LIMIT_EXCEEDED"
                    );
                }
            }
        }
        // Tournament cannot have been completed
        require(
            tournaments[id].status == TournamentStatus.ACTIVE,
            "INVALID_TOURNAMENT_STATUS"
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
            token.transferFrom(
                msg.sender,
                address(this),
                tournaments[id].entryFee
            ),
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
    * @param id Unique ID of the tournament
    * @param finalStandings Final standings for entries in the tournament
    * @param uniqueFinalStandings Number of unique positions in the final standing array
    * @return Whether the tournament was completed
    */
    function completeTournament(
        bytes32 id,
        uint256[] memory finalStandings,
        uint256 uniqueFinalStandings
    ) public returns (bool) {
        // Sender must be an admin
        require(
            admin.admins(msg.sender),
            "INVALID_SENDER"
        );
        // Must be a valid tournament
        require(
            tournaments[id].entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Tournament cannot have been completed
        require(
            tournaments[id].status == uint8(TournamentStatus.ACTIVE),
            "INVALID_TOURNAMENT_STATUS"
        );
        if(finalStandings.length > 0) {
            // Unique final standings must be greater than 0
            require(uniqueFinalStandings > 0);
            // Tournament successfully completed
            // Set finalStandings for the tournament
            for (uint256 i = 0; i < tournaments[id].entries.length; i++) {
                tournaments[id].entries[i].finalStanding = finalStandings[i];
            }
            // Set unique final standings
            tournaments[id].uniqueFinalStandings = uniqueFinalStandings;
            // Set tournament status to completed
            tournaments[id].status = uint8(TournamentStatus.COMPLETED);
            // Transfer tournament rake fee to platform wallet
            require(
                token.transfer(
                    admin.platformWallet(),
                    getRakeFee(id)
                ),
                "TOKEN_TRANSFER_ERROR"
            );
            // Emit log completed tournament event
            emit LogCompletedTournament(
                id,
                uint8(TournamentStatus.COMPLETED)
            );
        } else {
            // Tournament has ended unsuccessfully, allow users to claim refunds
            // Set tournament status to failed
            tournaments[id].status = uint8(TournamentStatus.FAILED);
            // Emit log completed tournament event
            emit LogCompletedTournament(
                id,
                uint8(TournamentStatus.FAILED)
            );
        }
    }

    /**
    * Allows users to claim their tournament prizes
    * @param id Unique ID of the tournament
    * @param index Index in the tournaments' entries
    * @return Whether the tournament prize was claimed
    */
    function claimTournamentPrize(
        bytes32 id,
        uint256 index
    ) public returns (bool) {
        // Must be a valid tournament
        require(
            tournaments[id].entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Tournament should have been completed
        require(
            tournaments[id].status == uint8(TournamentStatus.COMPLETED),
            "INVALID_TOURNAMENT_STATUS"
        );
        // Address at final standings index must be sender
        require(
            tournaments[id].entries[index]._address == msg.sender,
            "INVALID_FINAL_STANDINGS_INDEX"
        );
        // User cannot have already claimed their prize
        require(
            !tournaments[id].claimed[index],
            "INVALID_CLAIMED_STATUS"
        );
        // Prize table must have a valid prize at final standings index
        require(
            prizeTables
            [tournaments[id].prizeTable]
            [tournaments[id].entries[index].finalStanding] != 0,
            "INVALID_PRIZE_TABLE_INDEX"
        );
        // Check for other winners with same final standing
        uint256 sharedFinalStandings = 0;
        for(uint256 i = 0; i < tournaments[id].entries.length; i++) {
            if(
                tournaments[id].entries[i].finalStanding ==
                tournaments[id].entries[index].finalStanding
            )
                sharedFinalStandings++;
        }
        // Calculate prize pool
        uint256 prizePool = (tournaments[id].entries.length
                    .mul(tournaments[id].entryFee))
                    .sub(getRakeFee(id));
        uint256 prizePercent = (prizeTables[tournaments[id].prizeTable][index]);
        uint256 prizeMoney;
        // If the amount of prize winners is greater than the number of unique final standings,
        // split excess token % split among all addresses in final standings
        if(
            prizeTables[tournaments[id].prizeTable].length >
            tournaments[id].uniqueFinalStandings.length
        ) {
            uint256 excessPrizePercent;
            for(
                uint256 i = tournaments[id].uniqueFinalStandings.length;
                i < prizeTables[tournaments[id].prizeTable].length;
                i++
            ) {
                excessPrizePercent = excessPrizePercent.add(prizeTables[tournaments[id].prizeTable][i]);
            }
            prizePercent = prizePercent.add(excessPrizePercent);
        }
        // Transfer prize percent of total prize money divided by the number of winners for the same final standing index
        prizeMoney = prizePool
            .mul(prizePercent)
            .div(100)
            .div(sharedFinalStandings);
        // Transfer prize tokens to sender
        require(
            token.transfer(
                msg.sender,
                prizeMoney
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Mark prize as claimed
        tournaments[id].claimed[index] = true;
        // Emit log claimed tournament prize event
        emit LogClaimedTournamentPrize(
            id,
            tournaments[id].finalStandings[index],
            index,
            prizeTables[tournaments[id].prizeTable][index]
        );
    }

    /**
    * Allows users to claim refunds for tournaments that were not completed
    * @param id Unique tournament ID
    * @param index Entries index in the tournament's entries array
    * @return Whether entry fees were refunded for tournament entry
    */
    function claimTournamentRefund(
        bytes32 id,
        uint256 index
    )
    public
    returns (bool) {
        // Must be a valid tournament
        require(
            tournaments[id].entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Tournament should have a failed status
        require(
            tournaments[id].status == uint8(TournamentStatus.FAILED),
            "INVALID_TOURNAMENT_STATUS"
        );
        // Address at entries index must be sender
        require(
            tournaments[id].entries[index]._address == msg.sender,
            "INVALID_FINAL_STANDINGS_INDEX"
        );
        // User cannot have already claimed their refund
        require(
            !tournaments[id].refunded[index],
            "INVALID_REFUNDED_STATUS"
        );
        // Transfer entry fee to sender
        require(
            token.transfer(
                msg.sender,
                tournaments[id].entryFee
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Mark entry as refunded
        tournaments[id].refunded[index] = true;
        emit LogRefundedTournamentEntry(
            id,
            index
        );
    }

    /**
    * Returns rake fee for a tournament
    * @param id Unique tournament ID
    * @return tournament rake fee
    */
    function getRakeFee(
        bytes32 id
    )
    public
    view
    returns (uint256) {
        return (tournaments[id].entryFee)
            .mul(tournaments[id].entries.length)
            .mul(tournaments[id].rakePercent)
            .div(100);
    }

    /**
    * Returns an entry address at a tournament entries index
    * @param id Unique tournament ID
    * @param index Tournament entry index
    * @return Tournament entry at index
    */
    function getTournamentEntry(
        bytes32 id,
        uint256 index
    )
    public
    view
    returns (address) {
        return tournaments[id].entries[index];
    }

    /**
    * Returns a final standing for a tournament
    * @param id Unique tournament ID
    * @param index Tournament final standings index
    * @return Tournament final standing at index
    */
    function getTournamentFinalStanding(
        bytes32 id,
        uint256 index
    )
    public
    view
    returns (uint256) {
        return tournaments[id].finalStandings[index];
    }


}