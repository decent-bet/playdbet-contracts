pragma solidity 0.5.8;

import "./DBETNode.sol";

import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract NodeWallet {

    using SafeMath for uint256;

    // DBETNode contract
    DBETNode public dbetNode;

    // Fees collected per quest for a node
    mapping (uint256 => mapping (uint256 => uint256)) public questFees;
    // Total quest entry fees collected for a node
    mapping (uint256 => uint256) public totalQuestEntryFees = 0;
    // Total completed quest entry fees
    mapping (uint256 => uint256) public totalCompletedQuestEntryFees = 0;

    event LogAddQuestEntryFee(
        uint256 nodeId,
        uint256 questId
    );
    event LogAddCompletedQuestEntryFee(
        uint256 nodeId,
        uint256 questId
    );
    event LogWithdrawCompletedQuestEntryFees(
        uint256 nodeId,
        uint256 amount
    );

    constructor(
    )
    public {
        dbetNode = DBETNode(msg.sender);
        // Allow the quest contract to transfer tokens on behalf of this contract
        require(
            ERC20(dbetNode.token).approve(
                address(dbetNode.quest),
                // Max uint256
                (2 ** 256) - 1
            )
        );
    }

    /**
    * Add to total quest entry fees
    * @param nodeId Unique user node ID
    * @param questId Unique quest ID
    * @param fee Entry fee for quest
    * @return Whether quest entry was recorded
    */
    function addQuestEntryFee(
        uint256 nodeId,
        uint256 questId,
        uint256 fee
    )
    public
    returns (bool) {
        // Only callable from within the quest contract
        require(
            msg.sender == address(dbetNode.quest),
            "INVALID_SENDER"
        );
        // Add to quest fees mapping
        questFees[nodeId][questId] = questFees[nodeId][questId].add(fee);
        // Add to total quest fees
        totalQuestEntryFees[nodeId] = totalQuestEntryFees[nodeId].add(fee);
        // Emit log add quest entry fee event
        emit LogAddQuestEntryFee(
            nodeId,
            questId
        );
    }

    /**
    * Add to total completed fees on quest completion
    * @param questId Unique quest ID
    * @param fee Entry fee for quest
    * @return Whether completed quest was recorded
    */
    function completeQuest(
        uint256 questId,
        uint256 fee
    )
    public
    returns (bool) {
        // Only callable from within the quest contract
        require(
            msg.sender == address(dbetNode.quest),
            "INVALID_SENDER"
        );
        // Add to total completed quest fees
        totalCompletedQuestEntryFees[nodeId] = totalCompletedQuestEntryFees[nodeId].add(fee);
        // Emit log add quest entry fee event
        emit LogAddCompletedQuestEntryFee(
            nodeId,
            questId
        );
    }

    /**
    * Withdraw fees from completed quest entries
    * @param nodeId Unique node ID
    * @return Whether tokens were withdrawn
    */
    function withdrawCompletedQuestEntryFees(
        uint256 nodeId
    )
    public
    returns (bool) {
        // Sender must be node owner
        require(
            msg.sender == dbetNode.getNodeOwner(nodeId),
            "INVALID_SENDER"
        );
        // Node must be active
        require(
            dbetNode.isUserNodeActivated(nodeId),
            "INVALID_NODE_STATUS"
        );
        require(
            ERC20(dbetNode.token).transfer(
                msg.sender,
                totalCompletedQuestEntryFees[nodeId]
            ),
            "ERROR_TOKEN_TRANSFER"
        );
        emit LogWithdrawCompletedQuestEntryFees(
            nodeId,
            totalCompletedQuestEntryFees[nodeId]
        );
    }

}
