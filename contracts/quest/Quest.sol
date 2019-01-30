pragma solidity 0.5.0;

import "./interfaces/IQuest.sol";

contract Quest is
IQuest {

    // Owner of Quest contract
    address public owner;
    // Admins mapping
    mapping (address => bool) public admins;

    // On add admin event
    event LogAddAdmin(
        address indexed _address
    );
    // On remove admin event
    event LogRemoveAdmin(
        address indexed _address
    );

    constructor(
        address _owner
    ) {
        owner = _owner;
    }

    /**
    * Adds an admin to the market contract
    * @param _address Address to add as admin
    * @return whether admin was added
    */
    function addAdmin(
        address _address
    )
    public
    returns (bool) {
        require(msg.sender == owner);
        admins[_address] = true;
        emit LogAddAdmin(_address);
    }

    /**
    * Removes an admin from the market contract
    * @param _address Address of admin
    * @return whether admin was removed
    */
    function removeAdmin(
        address _address
    )
    public
    returns (bool) {
        require(msg.sender == owner);
        admins[_address] = false;
        emit LogRemoveAdmin(_address);
    }

}
