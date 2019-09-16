pragma solidity 0.5.8;

contract LibDBETNode {

    // Defines different types of DBET nodes that can be run
    struct NodeType {
        // Name of node
        string name;
        // Amount of tokens to lock
        uint256 tokenThreshold;
        // Minimum amount of time in seconds to hold tokens to activate node
        uint256 timeThreshold;
    }

    // User node
    struct Node {
        // Unique id of node type
        uint256 nodeType;
        // DBETs locked as deposit
        uint256 deposit;
        // Unix timestamp during creation
        uint256 creationTime;
        // Unix timestamp on destroy
        uint256 destroyTime;
    }

}
