pragma solidity ^0.4.0;

contract IQuest {

    /**
    * Adds an admin to the Quest contract
    * @param _address Address to add as admin
    * @return whether admin was added
    */
    function addAdmin(
        address _address
    ) public returns (bool);

    /**
    * Removes an admin from the Quest contract
    * @param _address Address of admin
    * @return whether admin was removed
    */
    function removeAdmin(
        address _address
    ) public returns (bool);

}
