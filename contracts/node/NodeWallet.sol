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
    // Tournament rake fees per tournament for a node
    // Node ID => (Tournament ID => Rake fees)
    mapping (uint256 => mapping (bytes32 => uint256)) public rakeFees;
    // Total tournament rake fees collected for a node
    // Node ID => Rake fees
    mapping (uint256 => uint256) public totalRakeFees;


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
    event LogAddTournamentRakeFees(
        uint256 nodeId,
        bytes32 tournamentId
    );
    event LogWithdrawTournamentRakeFees(
        uint256 nodeId,
        uint256 amount
    );

    constructor()
    public {
        dbetNode = DBETNode(msg.sender);
        // Allow the quest contract to transfer tokens on behalf of this contract
        require(
            ERC20(address(dbetNode.token())).approve(
                address(dbetNode.quest()),
            // Max uint256
                (2 ** 256) - 1
            ),
            "ERROR_APPROVE_TOKENS_QUEST_CONTRACT"
        );
        // Allow the tournament contract to transfer tokens on behalf of this contract
        require(
            ERC20(address(dbetNode.token())).approve(
                address(dbetNode.tournament()),
            // Max uint256
                (2 ** 256) - 1
            ),
            "ERROR_APPROVE_TOKENS_TOURNAMENT_CONTRACT"
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
            msg.sender == address(dbetNode.quest()),
            "INVALID_SENDER"
        );
        // Set in prize fund mapping
        prizeFund[nodeId][questId] = fund;
        // Emit log set prize fund event
        emit LogSetPrizeFund(
            nodeId,
            questId
        );
        return true;
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
            msg.sender == address(dbetNode.quest()),
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
        return true;
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
            msg.sender == address(dbetNode.quest()),
            "INVALID_SENDER"
        );
        // Add to total completed quest fees
        totalCompletedQuestEntryFees[nodeId] = totalCompletedQuestEntryFees[nodeId].add(fee);
        // Emit log add quest entry fee event
        emit LogAddCompletedQuestEntryFee(
            nodeId,
            questId
        );
        return true;
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
            msg.sender == address(dbetNode.quest()),
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
        return true;
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
        require(
            fees > 0,
            "COMPLETED_QUEST_ENTRY_FEES_UNAVAILABLE"
        );
        // Set fees to 0
        totalCompletedQuestEntryFees[nodeId] = 0;
        require(
            ERC20(address(dbetNode.token())).transfer(
                msg.sender,
                fees
            ),
            "ERROR_TOKEN_TRANSFER"
        );
        emit LogWithdrawCompletedQuestEntryFees(
            nodeId,
            fees
        );
        return true;
    }

    /**
    * Add to total tournament rake fees
    * @param nodeId Unique user node ID
    * @param tournamentId Unique tournament ID
    * @param rakeFee Rake fees collected for tournament
    * @return Whether rake fees were recorded
    */
    function addTournamentRakeFee(
        uint256 nodeId,
        bytes32 tournamentId,
        uint256 rakeFee
    )
    public
    returns (bool) {
        // Only callable from within the tournament contract
        require(
            msg.sender == address(dbetNode.tournament()),
            "INVALID_SENDER"
        );
        // Add to rake fees mapping
        rakeFees[nodeId][tournamentId] = rakeFees[nodeId][tournamentId].add(rakeFee);
        // Add to total rake fees
        totalRakeFees[nodeId] = totalRakeFees[nodeId].add(rakeFee);
        // Emit log add tournament rake fee event
        emit LogAddTournamentRakeFees(
            nodeId,
            tournamentId
        );
        return true;
    }

    /**
    * Withdraw rake fees from completed tournaments
    * @param nodeId Unique node ID
    * @return Whether tokens were withdrawn
    */
    function withdrawTournamentRakeFees(
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
        uint256 fees = totalRakeFees[nodeId];
        require(
            fees > 0,
            "COMPLETED_TOURNAMENT_RAKE_FEES_UNAVAILABLE"
        );
        // Set fees to 0
        totalRakeFees[nodeId] = 0;
        require(
            ERC20(address(dbetNode.token())).transfer(
                msg.sender,
                fees
            ),
            "ERROR_TOKEN_TRANSFER"
        );
        emit LogWithdrawTournamentRakeFees(
            nodeId,
            fees
        );
        return true;
    }

}