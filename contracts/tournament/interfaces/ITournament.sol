pragma solidity 0.5.0;

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
    * @param id unique ID of the tournament
    * @param finalStandings final standings of participants in the tournament
    * @return whether the tournament was completed
    */
    function completeTournament(
        bytes32 id,
        uint256[] memory finalStandings
    ) public returns (bool);

    /**
    * Allows users to claim their tournament prizes
    * @param id unique ID of the tournament
    * @param index final standing index in the tournaments' final standings
    * @return whether the tournament prize was claimed
    */
    function claimTournamentPrize(
        bytes32 id,
        uint256 index
    ) public returns (bool);

}