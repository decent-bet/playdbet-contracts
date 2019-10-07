pragma solidity 0.5.8;

import "./DBETNode.sol";

import "./libs/LibNodeWallet.sol";

import "../token/ERC20.sol";

import "../utils/SafeMath.sol";

contract NodeWallet is
LibNodeWallet {

    using SafeMath for uint256;

    // DBETNode contract
    DBETNode public dbetNode;

    // Prize fund per quest for a node
    // Offering type => (Node ID => (Quest ID => Prize fund))
    mapping (uint8 => mapping(uint256 => mapping (bytes32 => uint256))) public prizeFund;
    // Fees collected per offering event for a node
    // Offering type => (Node ID => (Quest ID => Fees)
    mapping (uint8 => mapping(uint256 => mapping (bytes32 => uint256))) public fees;
    // Total entry fees collected for a node
    // Offering type => (Node ID => entry fees)
    mapping (uint8 => mapping(uint256 => uint256)) public totalEntryFees;
    // Total completed entry fees
    // Offering type => (Node ID => Completed entry fees)
    mapping (uint8 => mapping(uint256 => uint256)) public totalCompletedEntryFees;

    event LogSetPrizeFund(
        uint8 offeringType,
        uint256 nodeId,
        bytes32 id
    );
    event LogAddEntryFee(
        uint8 offeringType,
        uint256 nodeId,
        bytes32 id
    );
    event LogAddCompletedEntryFee(
        uint8 offeringType,
        uint256 nodeId,
        bytes32 id
    );
    event LogClaimRefund(
        uint8 offeringType,
        uint256 nodeId,
        bytes32 id
    );
    event LogWithdrawCompletedEntryFees(
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
    * Sets the available prize fund for an offering
    * @param offeringType Quest or tournament
    * @param nodeId Unique user node ID
    * @param id Unique offering event ID
    * @param fund Prize fund for the quest
    * @return Whether prize fund for quest was recorded
    */
    function setPrizeFund(
        uint8 offeringType,
        uint256 nodeId,
        bytes32 id,
        uint256 fund
    )
    public
    returns (bool) {
        // Offering type must be valid
        require(
            isValidOfferingType(
                offeringType
            ),
            "INVALID_OFFERING_TYPE"
        );
        // Only callable from within the offering types' contract
        require(
            msg.sender == getOfferingContractAddress(offeringType),
            "INVALID_SENDER"
        );
        // Set in prize fund mapping
        prizeFund[offeringType][nodeId][id] = fund;
        // Emit log set prize fund event
        emit LogSetPrizeFund(
            offeringType,
            nodeId,
            id
        );
        return true;
    }

    /**
    * Add to total entry fees
    * @param offeringType Quest or tournament
    * @param nodeId Unique user node ID
    * @param id Unique offering event ID
    * @param fee Entry fee for offering event
    * @return Whether entry fee was recorded
    */
    function addEntryFee(
        uint8 offeringType,
        uint256 nodeId,
        bytes32 id,
        uint256 fee
    )
    public
    returns (bool) {
        // Offering type must be valid
        require(
            isValidOfferingType(
                offeringType
            ),
            "INVALID_OFFERING_TYPE"
        );
        // Only callable from within the offering types' contract
        require(
            msg.sender == getOfferingContractAddress(offeringType),
            "INVALID_SENDER"
        );
        // Add to fees mapping
        fees[offeringType][nodeId][id] = fees[offeringType][nodeId][id].add(fee);
        // Add to total entry fees
        totalEntryFees[offeringType][nodeId] = totalEntryFees[offeringType][nodeId].add(fee);
        // Emit log add quest entry fee event
        emit LogAddEntryFee(
            offeringType,
            nodeId,
            id
        );
        return true;
    }

    /**
    * Add to total completed fees on offering event completion
    * @param offeringType Quest or tournament
    * @param nodeId Unique user node ID
    * @param id Unique offering event ID
    * @param fee Entry fee for offering event
    * @return Whether completed offering event was recorded
    */
    function completeEvent(
        uint8 offeringType,
        uint256 nodeId,
        bytes32 id,
        uint256 fee
    )
    public
    returns (bool) {
        // Offering type must be valid
        require(
            isValidOfferingType(
                offeringType
            ),
            "INVALID_OFFERING_TYPE"
        );
        // Only callable from within the offering types' contract
        require(
            msg.sender == getOfferingContractAddress(offeringType),
            "INVALID_SENDER"
        );
        // Add to total completed fees
        totalCompletedEntryFees[offeringType][nodeId] = totalCompletedEntryFees[offeringType][nodeId].add(fee);
        // Emit log add entry fee event
        emit LogAddCompletedEntryFee(
            offeringType,
            nodeId,
            id
        );
        return true;
    }

    /**
    * Claim refund for an active offering event entry
    * @param offeringType Quest or tournament
    * @param nodeId Unique user node ID
    * @param id Unique offering event ID
    * @param fee Entry fee for offering event
    * @return Whether refund claim was recorded
    */
    function claimRefund(
        uint8 offeringType,
        uint256 nodeId,
        bytes32 id,
        uint256 fee
    )
    public
    returns (bool) {
        // Offering type must be valid
        require(
            isValidOfferingType(
                offeringType
            ),
            "INVALID_OFFERING_TYPE"
        );
        // Only callable from within the offering types' contract
        require(
            msg.sender == getOfferingContractAddress(offeringType),
            "INVALID_SENDER"
        );
        // Remove from quest fees mapping
        fees[offeringType][nodeId][id] = fees[offeringType][nodeId][id].sub(fee);
        // Remove from total entry fees
        totalEntryFees[offeringType][nodeId] = totalEntryFees[offeringType][nodeId].sub(fee);
        // Emit log claim refund event
        emit LogClaimRefund(
            offeringType,
            nodeId,
            id
        );
        return true;
    }

    /**
    * Withdraw fees from completed offering event entries
    * @param nodeId Unique node ID
    * @return Whether tokens were withdrawn
    */
    function withdrawCompletedEntryFees(
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
        uint256 questEntryFees = totalCompletedEntryFees[uint8(OfferingType.QUEST)][nodeId];
        uint256 tournamentEntryFees= totalCompletedEntryFees[uint8(OfferingType.TOURNAMENT)][nodeId];
        uint256 totalFees = questEntryFees.add(tournamentEntryFees);
        require(
            totalFees > 0,
            "COMPLETED_ENTRY_FEES_UNAVAILABLE"
        );
        // Set fees to 0
        totalCompletedEntryFees[uint8(OfferingType.QUEST)][nodeId] = 0;
        totalCompletedEntryFees[uint8(OfferingType.TOURNAMENT)][nodeId] = 0;
        require(
            ERC20(address(dbetNode.token())).transfer(
                msg.sender,
                totalFees
            ),
            "ERROR_TOKEN_TRANSFER"
        );
        emit LogWithdrawCompletedEntryFees(
            nodeId,
            totalFees
        );
        return true;
    }

    /**
    * Returns whether an offering type is valid
    * @param offeringType Offering type
    * @return whether offering type is valid
    */
    function isValidOfferingType(
        uint8 offeringType
    )
    public
    view
    returns (bool) {
        return (
            offeringType == uint8(OfferingType.QUEST) ||
            offeringType == uint8(OfferingType.TOURNAMENT)
        );
    }

    /**
    * Returns the contract address for an offering type
    * @param offeringType Offering type
    * @return offering contract address
    */
    function getOfferingContractAddress(
        uint8 offeringType
    )
    public
    view
    returns (address) {
        if (offeringType == uint8(OfferingType.QUEST))
            return address(dbetNode.quest());
        else if (offeringType == uint8(OfferingType.TOURNAMENT))
            return address(dbetNode.tournament());
    }

}
