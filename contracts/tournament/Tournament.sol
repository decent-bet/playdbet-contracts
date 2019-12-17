pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import "./interfaces/ITournament.sol";
import "./libs/LibTournament.sol";

import "../node/libs/LibDBETNode.sol";

import "../admin/Admin.sol";
import "../node/DBETNode.sol";
import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract Tournament is
ITournament,
LibTournament,
LibDBETNode {

    using SafeMath for uint256;

    // Owner of the tournament contract
    address public owner;
    // Admin contract
    Admin public admin;
    // Token contract
    ERC20 public token;
    // DBET node contract
    DBETNode public dbetNode;

    // Prize table mapping
    mapping (bytes32 => uint256[]) public prizeTables;
    // Tournaments mapping
    mapping (bytes32 => Tournament) public tournaments;
    // Prize table count
    uint256 public prizeTableCount;
    // Tournament count
    uint256 public tournamentCount;

    // Log new prize table
    event LogNewPrizeTable(
        bytes32 indexed id,
        uint256 indexed count,
        uint256 tableLength
    );
    // Log new tournament
    event LogNewTournament(
        bytes32 indexed id,
        uint256 indexed count
    );
    // Log entered tournament
    event LogEnteredTournament(
        bytes32 indexed id,
        address indexed participant,
        uint256 indexed entryIndex,
        uint256 entryFee
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
        uint256 finalStanding,
        uint256 prizeFromTable,
        uint256 prizeMoney,
        address indexed claimant
    );
    // Log refunded tournament entry
    event LogRefundedTournamentEntry(
        bytes32 indexed id,
        uint256 entryIndex,
        address indexed claimant
    );

    constructor (
        address _admin,
        address _token,
        address _dbetNode
    )
    public {
        owner = msg.sender;
        admin = Admin(_admin);
        token = ERC20(_token);
        dbetNode = DBETNode(_dbetNode);
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
            prizeTableCount++,
            table.length
        );
    }

    /**
    * Creates a tournament that users can enter
    * @param entryFee Fee to enter the tournament
    * @param entryLimit Entry limit for each unique address
    * @param minEntries The minimum number of entries for the tournament
    * @param maxEntries The maximum number of entries for the tournament
    * @param rakePercent Percentage of the prize pool retained by Decent.bet
    * @param prizeType Type of prize for tournament
    * @param prizeTable Unique ID of prize table to be used for the tournament
    * @return Unique ID of the created tournament
    */
    function createTournament(
        uint256 entryFee,
        uint256 entryLimit,
        uint256 minEntries,
        uint256 maxEntries,
        uint256 rakePercent,
        uint8 prizeType,
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
        // Must be a valid prize type
        require(
            prizeType >= uint8(TournamentPrizeType.STANDARD) &&
            prizeType <= uint8(TournamentPrizeType.FIFTY_FIFTY)
        );
        // If prize type is standard, prize table must be valid
        if(prizeType == uint8(TournamentPrizeType.STANDARD))
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
        tournaments[id].details = TournamentDetails({
            entryFee: entryFee,
            entryLimit: entryLimit,
            minEntries: minEntries,
            maxEntries: maxEntries,
            prizeTable: prizeTable,
            prizeType: prizeType,
            rakePercent: rakePercent
        });

        // Emit log new tournament event
        emit LogNewTournament(
            id,
            tournamentCount++
        );
    }

    /**
    * Creates a tournament using an active node that users can enter
    * @param nodeId Unique node ID in DBETNode contract
    * @param entryFee Fee to enter the tournament
    * @param entryLimit Entry limit for each unique address
    * @param minEntries The minimum number of entries for the tournament
    * @param maxEntries The maximum number of entries for the tournament
    * @param rakePercent Percentage of the prize pool retained by Decent.bet
    * @param prizeType Type of prize for tournament
    * @param prizeTable Unique ID of prize table to be used for the tournament
    * @return Unique ID of the created tournament
    */
    function createNodeTournament(
        uint256 nodeId,
        uint256 entryFee,
        uint256 entryLimit,
        uint256 minEntries,
        uint256 maxEntries,
        uint256 rakePercent,
        uint8 prizeType,
        bytes32 prizeTable
    ) public returns (bytes32) {
        // Allow only active node holders to add quests
        require(
            isActiveNode(
                nodeId,
                msg.sender
            ),
            "INVALID_NODE"
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
        // Must be a valid prize type
        require(
            prizeType >= uint8(TournamentPrizeType.STANDARD) &&
            prizeType <= uint8(TournamentPrizeType.FIFTY_FIFTY)
        );
        // If prize type is standard, prize table must be valid
        if(prizeType == uint8(TournamentPrizeType.STANDARD))
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
        tournaments[id].details = TournamentDetails({
            entryFee: entryFee,
            entryLimit: entryLimit,
            minEntries: minEntries,
            maxEntries: maxEntries,
            prizeTable: prizeTable,
            prizeType: prizeType,
            rakePercent: rakePercent
        });

        tournaments[id].isNode = true;
        tournaments[id].nodeId = nodeId;

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
            tournaments[id].details.entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Cannot have already entered the tournament if entryLimit is exceeded
        if (tournaments[id].details.entryLimit > 1) {
            uint256 entryCount = 0;
            for (uint256 i = 0; i < tournaments[id].entries.length; i++) {
                if(tournaments[id].entries[i]._address == msg.sender) {
                    require(
                        ++entryCount <= tournaments[id].details.entryLimit,
                        "ENTRY_LIMIT_EXCEEDED"
                    );
                }
            }
        }
        // Tournament cannot have been completed
        require(
            tournaments[id].status == uint8(TournamentStatus.ACTIVE),
            "INVALID_TOURNAMENT_STATUS"
        );
        // Cannot be over max entry count
        require(
            tournaments[id].entries.length <=
            tournaments[id].details.maxEntries,
            "MAX_ENTRY_COUNT_EXCEEDED"
        );
        // Must have a balance and allowance >= entryFee
        require(
            token.balanceOf(msg.sender) >= tournaments[id].details.entryFee &&
            token.allowance(msg.sender, address(this)) >= tournaments[id].details.entryFee,
            "INVALID_TOKEN_BALANCE_OR_ALLOWANCE"
        );
        if (tournaments[id].isNode)
            // Check if node is active
            require(
                isActiveNode(
                    tournaments[id].nodeId,
                    dbetNode.getNodeOwner(tournaments[id].nodeId)
                ),
                "INVALID_QUEST_NODE_STATUS"
            );
        uint256[] memory finalStandings;
        // Add to tournament
        tournaments[id].entries.push(TournamentEntry({
            _address: msg.sender,
            entryFee: tournaments[id].details.entryFee,
            finalStandings: finalStandings
        }));
        // Add to total tournament entry fees
        tournaments[id].totalEntryFees =
            tournaments[id].totalEntryFees.add(tournaments[id].details.entryFee);
        // Transfer tokens to contract
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                tournaments[id].details.entryFee
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Emit log entered tournament event
        emit LogEnteredTournament(
            id,
            msg.sender,
            tournaments[id].entries.length - 1,
            tournaments[id].details.entryFee
        );
    }

    /**
    * Allows users to enter a tournament by paying the listed entry fee with a discount
    * using an active DBET node
    * @param id Unique ID of the tournament
    */
    function enterTournamentWithNode(
        bytes32 id,
        uint256 nodeId
    ) public returns (bool) {
        // Must be a valid tournament
        require(
            tournaments[id].details.entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Allow only active node holders to pay for quests
        require(
            isActiveNode(
                nodeId,
                msg.sender
            ),
            "INVALID_NODE"
        );
        (uint256 node,,,,,) = dbetNode.userNodes(nodeId);
        // Get discounted entry fee for node
        uint256 entryFee = getEntryFeeForNodeType(
            node,
            tournaments[id].details.entryFee
        );
        // Cannot have already entered the tournament if entryLimit is exceeded
        if (tournaments[id].details.entryLimit > 1) {
            uint256 entryCount = 0;
            for (uint256 i = 0; i < tournaments[id].entries.length; i++) {
                if(tournaments[id].entries[i]._address == msg.sender) {
                    require(
                        ++entryCount <= tournaments[id].details.entryLimit,
                        "ENTRY_LIMIT_EXCEEDED"
                    );
                }
            }
        }
        // Tournament cannot have been completed
        require(
            tournaments[id].status == uint8(TournamentStatus.ACTIVE),
            "INVALID_TOURNAMENT_STATUS"
        );
        // Cannot be over max entry count
        require(
            tournaments[id].entries.length <=
            tournaments[id].details.maxEntries,
            "MAX_ENTRY_COUNT_EXCEEDED"
        );
        // Must have a balance and allowance >= entryFee
        require(
            token.balanceOf(msg.sender) >= entryFee &&
            token.allowance(msg.sender, address(this)) >= entryFee,
            "INVALID_TOKEN_BALANCE_OR_ALLOWANCE"
        );
        if (tournaments[id].isNode)
            // Check if node is active
            require(
                isActiveNode(
                    tournaments[id].nodeId,
                    dbetNode.getNodeOwner(tournaments[id].nodeId)
                ),
                "INVALID_QUEST_NODE_STATUS"
            );
        uint256[] memory finalStandings;
        // Add entry to tournament
        tournaments[id].entries.push(TournamentEntry({
            _address: msg.sender,
            entryFee: entryFee,
            finalStandings: finalStandings
        }));
        // Add to total tournament entry fees
        tournaments[id].totalEntryFees = tournaments[id].totalEntryFees.add(entryFee);
        // Transfer tokens to contract
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                entryFee
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Emit log entered tournament event
        emit LogEnteredTournament(
            id,
            msg.sender,
            tournaments[id].entries.length - 1,
            entryFee
        );
    }

    /**
    * Allows admins to complete tournaments by publishing it's final standings
    * @param id Unique ID of the tournament
    * @param finalStandings Final standings for entries in the tournament. 1d index => entry index, 2d => final standings for entry index
    * @param uniqueFinalStandings Number of unique positions in the final standing array
    * @return Whether the tournament was completed
    */
    function completeTournament(
        bytes32 id,
        uint256[][] memory finalStandings,
        uint256 uniqueFinalStandings
    ) public returns (bool) {
        // Sender must be an admin
        require(
            admin.admins(msg.sender),
            "INVALID_SENDER"
        );
        // Must be a valid tournament
        require(
            tournaments[id].details.entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Tournament cannot have been completed
        require(
            tournaments[id].status == uint8(TournamentStatus.ACTIVE),
            "INVALID_TOURNAMENT_STATUS"
        );
        if(finalStandings.length > 0) {
            // Unique final standings must be greater than 0
            require(
                uniqueFinalStandings > 0,
                "INVALID_UNIQUE_FINAL_STANDINGS"
            );
            // Tournament successfully completed
            // Set finalStandings for the tournament
            for (uint256 i = 0; i < tournaments[id].entries.length; i++) {
                tournaments[id].entries[i].finalStandings = finalStandings[i];
                for (uint256 j = 0; j < finalStandings[i].length; j++) {
                    // i => index 1, j => index 2
                    // Push entry index to prizes mapping in tournament
                    tournaments[id].prizes[finalStandings[i][j]].push(i);
                }
            }
            // Set unique final standings
            tournaments[id].uniqueFinalStandings = uniqueFinalStandings;
            // Set tournament status to completed
            tournaments[id].status = uint8(TournamentStatus.COMPLETED);
            if (tournaments[id].isNode) {
                // Record rake fee transfer in node wallet
                require(
                    dbetNode.nodeWallet().addTournamentRakeFee(
                        tournaments[id].nodeId,
                        id,
                        getRakeFee(id)
                    ),
                    "ERROR_ADDING_NODE_WALLET_RAKE_FEE"
                );
                // Transfer tournament rake fee to node wallet
                require(
                    token.transfer(
                        address(dbetNode.nodeWallet()),
                        getRakeFee(id)
                    ),
                    "TOKEN_TRANSFER_ERROR"
                );
            } else {
                // Transfer tournament rake fee to platform wallet
                require(
                    token.transfer(
                        admin.platformWallet(),
                        getRakeFee(id)
                    ),
                    "TOKEN_TRANSFER_ERROR"
                );
            }
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
    * @param entryIndex Index in the tournaments' entries
    * @param finalStandingIndex Index in the tournaments' entries final standings
    * @return Whether the tournament prize was claimed
    */
    function claimTournamentPrize(
        bytes32 id,
        uint256 entryIndex,
        uint256 finalStandingIndex
    )
    public
    returns (bool) {
        // Must be a valid tournament
        require(
            tournaments[id].details.entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Tournament should have been completed
        require(
            tournaments[id].status == uint8(TournamentStatus.COMPLETED),
            "INVALID_TOURNAMENT_STATUS"
        );
        // Address at final standings index must be sender
        require(
            tournaments[id].entries[entryIndex]._address == msg.sender ||
            admin.admins(msg.sender),
            "INVALID_ENTRY_INDEX_OR_SENDER"
        );
        // User cannot have already claimed their prize
        require(
            !tournaments[id].claimed[entryIndex][finalStandingIndex],
            "INVALID_CLAIMED_STATUS"
        );
        require(
            tournaments[id].entries[entryIndex].finalStandings.length >
            finalStandingIndex,
            "INVALID_FINAL_STANDINGS_INDEX"
        );
        uint256 finalStanding =
            tournaments[id]
            .entries[entryIndex]
            .finalStandings[finalStandingIndex];
        // Prize table must have a valid prize at final standings index
        if (
            tournaments[id].details.prizeType ==
            uint8(TournamentPrizeType.STANDARD)
        )
            require(
                prizeTables
                [tournaments[id].details.prizeTable]
                [finalStanding] != 0,
                "INVALID_PRIZE_TABLE_INDEX"
            );
        else if (
            tournaments[id].details.prizeType ==
            uint8(TournamentPrizeType.WINNER_TAKE_ALL)
        )
            // Only #1 wins if prize type is winner take all
            require(
                finalStanding == 0,
                "INVALID_FINAL_STANDING"
            );
        else if (
            tournaments[id].details.prizeType ==
            uint8(TournamentPrizeType.FIFTY_FIFTY)
        )
            // Top 50% wins with 50-50 prize type
            require(
                finalStanding < tournaments[id].uniqueFinalStandings.div(2),
                "INVALID_FINAL_STANDING"
            );
        uint256 prizeMoney = _calculatePrizeMoney(
            id,
            finalStanding
        );
        address prizeWinner = tournaments[id].entries[entryIndex]._address;
        // Transfer prize tokens to sender
        require(
            token.transfer(
                prizeWinner,
                prizeMoney
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Mark prize as claimed
        tournaments[id].claimed[entryIndex][finalStandingIndex] = true;
        // Emit log claimed tournament prize event
        emit LogClaimedTournamentPrize(
            id,
            entryIndex,
            finalStanding,
            tournaments[id].details.prizeType == uint8(TournamentPrizeType.STANDARD) ?
                prizeTables[tournaments[id].details.prizeTable][finalStanding] :
                0,
            prizeMoney,
            msg.sender
        );
    }

    /**
    * Calculates prize money for a provided final standing position in a given unique tournament id
    * @param id Prize table ID
    * @param finalStanding Final standing position
    * @return Prize money for a final standing position
    */
    function _calculatePrizeMoney(
        bytes32 id,
        uint256 finalStanding
    )
    public
    view
    returns (uint256) {
        if(tournaments[id].details.prizeType == uint8(TournamentPrizeType.STANDARD))
            return _calculatePrizeMoneyForStandardPrizeType(
                id,
                finalStanding
            );
        else if(tournaments[id].details.prizeType == uint8(TournamentPrizeType.WINNER_TAKE_ALL)) {
            return _calculatePrizeMoneyForWinnerTakeAllPrizeType(
                id,
                finalStanding
            );
        }
        else if(tournaments[id].details.prizeType == uint8(TournamentPrizeType.FIFTY_FIFTY)) {
            return _calculatePrizeMoneyForFiftyFiftyPrizeType(
                id,
                finalStanding
            );
        }
    }

    /**
    * Calculates prize money for a provided final standing position in a given unique tournament ID
    * having a standard prize type
    * @param id Prize table ID
    * @param finalStanding Final standing position
    * @return Prize money for a final standing position
    */
    function _calculatePrizeMoneyForStandardPrizeType(
        bytes32 id,
        uint256 finalStanding
    )
    public
    view
    returns (uint256) {
        // Check for other winners with same final standing
        uint256 sharedFinalStandings =
            tournaments[id].prizes[finalStanding].length;
        uint256 prizePercent =
            prizeTables[tournaments[id].details.prizeTable][finalStanding];
        uint256 excessPrizePercent;
        uint256 multiplier = 1000;
        // If the amount of prize winners in the prize table is greater than the number of unique final standings,
        // split excess token % split among all addresses in final standings
        if(
            prizeTables[tournaments[id].details.prizeTable].length >
            tournaments[id].uniqueFinalStandings
        ) {
            for(
                uint256 i = tournaments[id].uniqueFinalStandings;
                i < prizeTables[tournaments[id].details.prizeTable].length;
                i++
            ) {
                excessPrizePercent = excessPrizePercent.add(prizeTables[tournaments[id].details.prizeTable][i]);
            }
            // Users get a % of the excess prize percent in proportion to their prize percent of the overall winnings.
            // For example, in case of a user winning 50%, with another user winning 30% and the excess prize percent being 20%.
            // The excess prize percent for the user would be 50/(100 - 20) * 20
            excessPrizePercent =
                excessPrizePercent
                .mul(prizePercent)
                .mul(multiplier)
                .div(
                    uint256(100)
                    .sub(excessPrizePercent)
                );
        }
        prizePercent = prizePercent.mul(multiplier).add(excessPrizePercent);
        // Transfer prize percent of total prize money divided by the number of winners for the same final standing index
        return getPrizePool(id)
            .mul(prizePercent)
            .div(multiplier)
            .div(100)
            .div(sharedFinalStandings);
    }

    /**
    * Calculates prize money for a provided final standing position in a given unique tournament ID
    * having a winner take all prize type
    * @param id Prize table ID
    * @param finalStanding Final standing position
    * @return Prize money for a final standing position
    */
    function _calculatePrizeMoneyForWinnerTakeAllPrizeType(
        bytes32 id,
        uint256 finalStanding
    )
    public
    view
    returns (uint256) {
        // Check for other winners with same final standing
        uint256 sharedFinalStandings =
            tournaments[id].prizes[finalStanding].length;
        return getPrizePool(id)
            .div(sharedFinalStandings);
    }

    /**
    * Calculates prize money for a provided final standing position in a given unique tournament ID
    * having a 50-50 prize type
    * @param id Prize table ID
    * @param finalStanding Final standing position
    * @return Prize money for a final standing position
    */
    function _calculatePrizeMoneyForFiftyFiftyPrizeType(
        bytes32 id,
        uint256 finalStanding
    )
    public
    view
    returns (uint256) {
        // Check for other winners with same final standing
        uint256 sharedFinalStandings =
            tournaments[id].prizes[finalStanding].length;
        uint256 winnerCount =
            tournaments[id].uniqueFinalStandings.div(2);
        return getPrizePool(id)
            .div(winnerCount)
            .div(sharedFinalStandings);
    }

    /**
    * Allows users to claim refunds for tournaments that were not completed
    * @param id Unique tournament ID
    * @param entryIndex Entries index in the tournament's entries array
    * @return Whether entry fees were refunded for tournament entry
    */
    function claimTournamentRefund(
        bytes32 id,
        uint256 entryIndex
    )
    public
    returns (bool) {
        // Must be a valid tournament
        require(
            tournaments[id].details.entryFee != 0,
            "INVALID_TOURNAMENT_ID"
        );
        // Tournament should have a failed status
        require(
            tournaments[id].status == uint8(TournamentStatus.FAILED),
            "INVALID_TOURNAMENT_STATUS"
        );
        // Address at entries entryIndex must be sender
        require(
            tournaments[id].entries[entryIndex]._address == msg.sender ||
            admin.admins(msg.sender),
            "INVALID_SENDER_OR_ENTRY_INDEX"
        );
        // User cannot have already claimed their refund
        require(
            !tournaments[id].refunded[entryIndex],
            "INVALID_REFUNDED_STATUS"
        );
        address entrant = tournaments[id].entries[entryIndex]._address;
        // Transfer entry fee to sender
        require(
            token.transfer(
                entrant,
                tournaments[id].entries[entryIndex].entryFee
            ),
            "TOKEN_TRANSFER_ERROR"
        );
        // Mark entry as refunded
        tournaments[id].refunded[entryIndex] = true;
        emit LogRefundedTournamentEntry(
            id,
            entryIndex,
            msg.sender
        );
    }

    /**
    * Returns the prize pool for a given tournament ID
    * @param id Unique tournament ID
    * @return Total prize pool in wei
    */
    function getPrizePool(
        bytes32 id
    )
    public
    view
    returns (uint256) {
        return (tournaments[id].totalEntryFees)
            .sub(getRakeFee(id));
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
        return (tournaments[id].totalEntryFees)
            .mul(tournaments[id].details.rakePercent)
            .div(100);
    }

    /**
    * Returns an entry address at a tournament entries index
    * @param id Unique tournament ID
    * @param entryIndex Tournament entry index
    * @return Tournament entry at index
    */
    function getTournamentEntry(
        bytes32 id,
        uint256 entryIndex
    )
    public
    view
    returns (TournamentEntry memory) {
        return tournaments[id].entries[entryIndex];
    }

    /**
    * Returns the number of final standings at a given tournament entries index
    * @param id Unique tournament ID
    * @param entryIndex Tournament entry index
    * @return Number of final standings for tournament entry at index
    */
    function getTournamentEntryFinalStandingLength(
        bytes32 id,
        uint256 entryIndex
    )
    public
    view
    returns (uint256) {
        return tournaments[id].entries[entryIndex].finalStandings.length;
    }

    /**
    * Returns a final standing for a tournament entry
    * @param id Unique tournament ID
    * @param entryIndex Tournament entry index
    * @param finalStandingIndex Tournament entry final standing index
    * @return Tournament final standing at index
    */
    function getTournamentFinalStanding(
        bytes32 id,
        uint256 entryIndex,
        uint256 finalStandingIndex
    )
    public
    view
    returns (uint256) {
        return tournaments[id]
                .entries[entryIndex]
                .finalStandings[finalStandingIndex];
    }

    /**
    * Returns the number of tournament prize winners for a provided final standing position
    * @param id Unique tournament ID
    * @param finalStanding Tournament final standing position
    */
    function getTournamentPrizeWinnersLength(
        bytes32 id,
        uint256 finalStanding
    )
    public
    view
    returns (uint256) {
        return tournaments[id]
                .prizes[finalStanding]
                .length;
    }

    /**
    * Returns a tournament prize winner at a provided final standing and prize winner index
    * @param id Unique tournament ID
    * @param finalStanding Tournament final standing position
    * @param prizeWinnerIndex Index of prize winner in tournaments' prizes array
    */
    function getTournamentPrizeWinnerAtIndex(
        bytes32 id,
        uint256 finalStanding,
        uint256 prizeWinnerIndex
    )
    public
    view
    returns (uint256) {
        return tournaments[id]
                .prizes[finalStanding]
                [prizeWinnerIndex];
    }

    /**
    * Returns whether an input node ID and owner is valid and active
    * @param id Unique node ID
    * @param nodeOwner Address of node owner
    * @return Whether node is active
    */
    function isActiveNode(
        uint256 id,
        address nodeOwner
    )
    public
    view
    returns (bool) {
        return (
            dbetNode.isUserNodeActivated(id) &&
            dbetNode.isTournamentNode(id) &&
            dbetNode.getNodeOwner(id) == nodeOwner
        );
    }

    /**
    * Returns entry fees for node types
    * @param nodeType Type of node
    * @return Entry fee after discount for node type
    */
    function getEntryFeeForNodeType(
        uint256 nodeType,
        uint256 entryFee
    )
    public
    view
    returns (uint256) {
        (,,,,uint256 discount,,,,) = dbetNode.nodes(nodeType);
        // entryFee * (1 - discount)/100
        return entryFee.mul(uint256(100).sub(discount)).div(100);
    }

}