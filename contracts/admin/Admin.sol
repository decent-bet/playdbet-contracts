pragma solidity 0.5.0;

import "./interfaces/IAdmin.sol";

contract Admin is
IAdmin {

    // Owner of the admin contract
    address public owner;
    // Platform wallet address
    address public platformWallet;
    // Admins mapping
    mapping (address => bool) public admins;

    // On set platform wallet event
    event LogOnSetPlatformWallet(
        address wallet
    );
    // On add admin event
    event LogAddAdmin(
        address indexed _address
    );
    // On remove admin event
    event LogRemoveAdmin(
        address indexed _address
    );

    constructor()
    public {
        owner = msg.sender;
        addAdmin(owner);
    }

    /**
    * Sets the platform wallet to send/receive payments
    */
    function setPlatformWallet(
        address _platformWallet
    )
    public
    returns (bool) {
        // Only the owner can set the platform wallet address
        require(msg.sender == owner);
        platformWallet = _platformWallet;
        emit LogOnSetPlatformWallet(
            _platformWallet
        );
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
