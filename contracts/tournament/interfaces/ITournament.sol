pragma solidity 0.5.0;

contract ITournament {

    /**
    * Creates a prize table that can be used for a tournament
    */
    function createPrizeTable() public returns (bool);

    /**
    * Creates a tournament that users can enter
    */
    function createTournament() public returns (bool);

    /**
    * Allows users to enter a tournament by paying the listed entry fee
    */
    function enterTournament() public returns (bool);

    /**
    * Allows the admin to complete the tournament by publishing the final standings
    */
    function completeTournament() public returns (bool);

    /**
    * Allows users to claim their tournament prizes
    */
    function claimTournamentPrize() public returns (bool);

}