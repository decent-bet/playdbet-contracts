pragma solidity 0.5.0;

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

}
