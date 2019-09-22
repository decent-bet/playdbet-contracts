pragma solidity 0.5.8;

contract LibDBETNode {

    enum NodeType {
        HOUSE_NODE,
        REWARD_NODE
    }

    // Defines different types of DBET nodes that can be run
    struct Node {
        // Name of node
        string name;
        // Amount of tokens to lock
        uint256 tokenThreshold;
        // Minimum amount of time in seconds to hold tokens to activate node
        uint256 timeThreshold;
    }

    // User node
    struct UserNode {
        // Unique id of node type
        uint256 node;
        // Node owner address
        address owner;
        // DBETs locked as deposit
        uint256 deposit;
        // Unix timestamp during creation
        uint256 creationTime;
        // Unix timestamp on destroy
        uint256 destroyTime;
    }

}
