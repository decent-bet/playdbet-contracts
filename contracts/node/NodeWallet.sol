pragma solidity 0.5.8;

import "./DBETNode.sol";

import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract NodeWallet {

    using SafeMath for uint256;

    // DBETNode contract
    DBETNode public dbetNode;

    // Prize fund per quest for a node
    // Node ID => (Quest ID => Prize fund)
    mapping (uint256 => mapping (bytes32 => uint256)) public prizeFund;
    // Fees collected per quest for a node
    // Node ID => (Quest ID => Fees)
    mapping (uint256 => mapping (bytes32 => uint256)) public questFees;
    // Total quest entry fees collected for a node
    // Node ID => Quest entry fees
    mapping (uint256 => uint256) public totalQuestEntryFees;
    // Total completed quest entry fees
    // Node ID => Quest entry fees
    mapping (uint256 => uint256) public totalCompletedQuestEntryFees;

    event LogSetPrizeFund(
        uint256 nodeId,
        bytes32 questId
    );
    event LogAddQuestEntryFee(
        uint256 nodeId,
        bytes32 questId
    );
    event LogAddCompletedQuestEntryFee(
        uint256 nodeId,
        bytes32 questId
    );
    event LogClaimRefund(
        uint256 nodeId,
        bytes32 questId
    );
    event LogWithdrawCompletedQuestEntryFees(
        uint256 nodeId,
        uint256 amount
    );

    constructor()
    public {
        dbetNode = DBETNode(msg.sender);
        // Allow the quest contract to transfer tokens on behalf of this contract
        require(
            ERC20(address(dbetNode.token)).approve(
                address(dbetNode.quest),
                // Max uint256
                (2 ** 256) - 1
            )
        );
    }

    /**
    * Sets the available prize fund for a quest
    * @param nodeId Unique user node ID
    * @param questId Unique quest ID
    * @param fund Prize fund for the quest
    * @return Whether prize fund for quest was recorded
    */
    function setPrizeFund(
        uint256 nodeId,
        bytes32 questId,
        uint256 fund
    )
    public
    returns (bool) {
        // Only callable from within the quest contract
        require(
            msg.sender == address(dbetNode.quest),
            "INVALID_SENDER"
        );
        // Set in prize fund mapping
        prizeFund[nodeId][questId] = fund;
        // Emit log set prize fund event
        emit LogSetPrizeFund(
            nodeId,
            questId
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
        bytes32 questId,
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
    * @param nodeId Node ID
    * @param questId Unique quest ID
    * @param fee Entry fee for quest
    * @return Whether completed quest was recorded
    */
    function completeQuest(
        uint256 nodeId,
        bytes32 questId,
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
    * Claim refund for an active quest entry
    * @param nodeId Node ID
    * @param questId Unique quest ID
    * @param fee Entry fee for quest
    * @return Whether refund claim was recorded
    */
    function claimRefund(
        uint256 nodeId,
        bytes32 questId,
        uint256 fee
    )
    public
    returns (bool) {
        // Only callable from within the quest contract
        require(
            msg.sender == address(dbetNode.quest),
            "INVALID_SENDER"
        );
        // Remove from quest fees mapping
        questFees[nodeId][questId] = questFees[nodeId][questId].sub(fee);
        // Remove from total quest fees
        totalQuestEntryFees[nodeId] = totalQuestEntryFees[nodeId].sub(fee);
        // Emit log claim refund event
        emit LogClaimRefund(
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
        uint256 fees = totalCompletedQuestEntryFees[nodeId];
        // Set fees to 0
        totalCompletedQuestEntryFees = 0;
        require(
            ERC20(address(dbetNode.token)).transfer(
                msg.sender,
                fees
            ),
            "ERROR_TOKEN_TRANSFER"
        );
        emit LogWithdrawCompletedQuestEntryFees(
            nodeId,
            fees
        );
    }

}
