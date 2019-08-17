pragma solidity 0.5.8;

contract IAdmin {

    /**
    * Adds an admin to the Admin contract
    * @param _address Address to add as admin
    * @return whether admin was added
    */
    function addAdmin(
        address _address
    ) public returns (bool);

    /**
    * Removes an admin from the Admin contract
    * @param _address Address of admin
    * @return whether admin was removed
    */
    function removeAdmin(
        address _address
    ) public returns (bool);

    /**
    * Sets the platform wallet to send/receive payments
    * @param _platformWallet Address of platform wallet
    * @return whether platform wallet was set
    */
    function setPlatformWallet(
        address _platformWallet
    ) public returns (bool);

    /**
    * Allows owners to set new owners for the contract
    * @param _owner Address of new owner
    * @return whether owner was added
    */
    function setOwner(
        address _owner
    ) public returns (bool);

}
