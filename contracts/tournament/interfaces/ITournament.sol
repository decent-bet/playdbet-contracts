pragma solidity 0.5.0;
pragma experimental ABIEncoderV2;

contract ITournament {

    /**
    * Creates a prize table that can be used for a tournament
    * @param table array of integers representing redeemable prize money for each position represented by indices in the array
    * @return unique ID of the prize table
    */
    function createPrizeTable(
        uint256[] memory table
    ) public returns (bytes32);

    /**
    * Creates a tournament that users can enter
    * @param entryFee fee to enter the tournament
    * @param entryLimit Entry limit for each unique address
    * @param minEntries the minimum number of entries for the tournament
    * @param maxEntries the maximum number of entries for the tournament
    * @param rakePercent percentage of the prize pool retained by Decent.bet
    * @param prizeTable unique ID of prize table to be used for the tournament
    * @return unique ID of the created tournament
    */
    function createTournament(
        uint256 entryFee,
        uint256 entryLimit,
        uint256 minEntries,
        uint256 maxEntries,
        uint256 rakePercent,
        bytes32 prizeTable
    ) public returns (bytes32);

    /**
    * Allows users to enter a tournament by paying the listed entry fee
    * @param id unique ID of the tournament
    */
    function enterTournament(
        bytes32 id
    ) public returns (bool);

    /**
    * Allows the admin to complete the tournament by publishing the final standings
    * @param id Unique ID of the tournament
    * @param finalStandings Final standings for entries in the tournament. 1d index => entry index, 2d => final standings for entry index
    * @param uniqueFinalStandings Number of unique positions in the final standing array
    * @return Whether the tournament was completed
    */
    function completeTournament(
        bytes32 id,
        uint256[][] memory finalStandings,
        uint256 uniqueFinalStandings
    ) public returns (bool);

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
    ) public returns (bool);

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
    returns (bool);

}