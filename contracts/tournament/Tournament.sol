pragma solidity 0.5.0;

import "./interfaces/ITournament.sol";
import "./libs/LibTournament.sol";

import "../admin/Admin.sol";

contract Tournament is
ITournament,
LibTournament {

    // Owner of the tournament contract
    address public owner;
    // Admin contract
    Admin public admin;

    // Prize table mapping
    mapping (bytes32 => uint256[]) prizeTables;
    // Prize table count
    uint256 public prizeTableCount;

    // Log new prize table
    event LogNewPrizeTable(
        bytes32 indexed id,
        uint256 indexed count
    );

    constructor (
        address _admin
    )
    public {
        owner = msg.sender;
        admin = Admin(_admin);
    }

    /**
    * Creates a prize table that can be used for a tournament
    * @param table array of integers representing redeemable prize money for each position represented by indices in the array
    * @return unique ID of the prize table
    */
    function createPrizeTable(
        uint256[] table
    ) public returns (bytes32) {
        require(table.length > 0);
        bytes32 id = sha3(
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
    * @param maxParticipants the maximum number of participants for the tournament
    * @param prizeTable unique ID of prize table to be used for the tournament
    * @return unique ID of the created tournament
    */
    function createTournament(
        uint256 entryFee,
        uint256 maxParticipants,
        bytes32 prizeTable
    ) public returns (bytes32) {

    }

    /**
    * Allows users to enter a tournament by paying the listed entry fee
    * @param id unique ID of the tournament
    */
    function enterTournament(
        bytes32 id
    ) public returns (bool) {

    }

    /**
    * Allows the admin to complete the tournament by publishing the final standings
    * @param id unique ID of the tournament
    * @param finalStandings final standings of participants in the tournament
    * @return whether the tournament was completed
    */
    function completeTournament(
        bytes32 id,
        address[] finalStandings
    ) public returns (bool) {

    }

    /**
    * Allows users to claim their tournament prizes
    * @param id unique ID of the tournament
    * @return whether the tournament prize was claimed
    */
    function claimTournamentPrize(
        bytes32 id
    ) public returns (bool) {

    }

}