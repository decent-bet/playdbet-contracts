pragma solidity 0.5.8;

import "./interfaces/IDBETNode.sol";
import "./libs/LibDBETNode.sol";

import "../admin/Admin.sol";

import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract DBETNode is
IDBETNode,
LibDBETNode {

    constructor()
    public {

    }

}
