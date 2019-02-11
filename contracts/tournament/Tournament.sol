pragma solidity 0.5.0;

contract Tournament {

    // Owner of the tournament contract
    address public owner;

    constructor ()
    public {
        owner = msg.sender;
    }

}