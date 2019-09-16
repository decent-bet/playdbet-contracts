pragma solidity 0.5.8;

import "./interfaces/IDBETNode.sol";
import "./libs/LibDBETNode.sol";

import "../admin/Admin.sol";

import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract DBETNode is
IDBETNode,
LibDBETNode {

    address public owner;

    // Admin contract
    Admin public admin;
    // Token contract
    ERC20 public token;

    // Maps incremented indices of added node types to NodeType structs
    mapping (uint256 => NodeType) public nodeTypes;
    // Auto-increment on addition of node types
    uint256 public nodeTypeCount;

    event LogNewNode(

    );
    event LogNewNodeType(
        uint256 id
    );

    constructor(
        address _admin,
        address _token
    )
    public {
        owner = msg.sender;
        admin = Admin(_admin);
        token = ERC20(_token);
    }

    function create(
    )
    public {

    }

    function destroy()
    public {

    }

    /**
    * Adds a new node type
    */
    function addType(
        string name,
        uint256 tokenThreshold,
        uint256 timeThreshold
    )
    public {
        // Sender must be an admin
        require(
            admin.admins(msg.sender),
            "INVALID_SENDER"
        );
        // Name cannot be empty
        require(
            name != "",
            "INVALID_NAME"
        );
        // Must be a non-zero token threshold
        require(
            tokenThreshold > 0,
            "INVALID_TOKEN_THRESHOLD"
        );
        // Must be a non-zero time threshold
        require(
            timeThreshold > 0,
            "INVALID_TIME_THRESHOLD"
        );
        nodeTypes[nodeTypeCount] = NodeType({
            name: name,
            tokenThreshold: tokenThreshold,
            timeThreshold: timeThreshold
        });
        emit LogNewNodeType(nodeTypeCount++);
    }

}
