pragma solidity 0.5.8;

contract LibDBETNode {

    enum NodeType {
        HOUSE_NODE,
        REWARD_NODE
    }

    enum Rewards {
        INCREASED_PRIZE_PAYOUTS,
        INCREASED_REFER_A_FRIEND,
        CREATE_QUEST,
        CREATE_PRIVATE_QUEST,
        CREATE_WHITELIST_QUEST,
        CREATE_TOURNAMENT
    }

    // Defines different types of DBET nodes that can be run
    struct Node {
        // Name of node
        string name;
        // Amount of tokens to lock
        uint256 tokenThreshold;
        // Minimum amount of time in seconds to hold tokens to activate node
        uint256 timeThreshold;
        // Maximum number of consecutive nodes with a deposit that can exist at a time
        // Note: This isn't an active node count
        uint256 maxCount;
        // List of rewards linked to this node type
        uint8[] rewards;
        // Number of nodes created of this type
        uint256 count;
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
        // Node count for node type
        uint256 index;
    }

}
