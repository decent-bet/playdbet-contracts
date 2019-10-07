const BigNumber = require('bignumber.js')
const timeTraveler = require('ganache-time-traveler')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')
const {
    getNode,
    getValidNodeQuestParams
} = require('./utils/nodes')

let admin
let dbetNode
let nodeWallet
let quest
let token

let owner
let user1
let user2
let user3
let nodeHolder

const web3 = utils.getWeb3()
const nodeId = 0

const OUTCOME_SUCCESS = 2

const OFFERING_TYPE_QUEST = 0
const OFFERING_TYPE_TOURNAMENT = 1

const timeTravel = async timeDiff => {
    await timeTraveler.advanceTime(timeDiff)
}

contract('NodeWallet', accounts => {
    it('initializes NodeWallet contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        nodeHolder = accounts[4]

        admin = await contracts.Admin.deployed()
        dbetNode = await contracts.DBETNode.deployed()
        quest = await contracts.Quest.deployed()
        token = await contracts.DBETVETToken.deployed()

        nodeWallet = await contracts.NodeWallet.at(
            await dbetNode.nodeWallet()
        )

        // Set platform wallet address in admin
        await admin.setPlatformWallet(
            user2,
            {
                from: owner
            }
        )

        const platformWallet = await admin.platformWallet()
        assert.equal(
            platformWallet,
            user2
        )

        // Approve platform wallet to transfer DBETs for prizes
        await token.approve(
            quest.address,
            web3.utils.toWei('1000000000', 'ether'),
            {
                from: user2
            }
        )

        // Transfer DBETs to platform wallet
        await token.transfer(
            user2,
            web3.utils.toWei('1000000', 'ether')
        )

        // Transfer DBETs to node holder
        await token.transfer(
            nodeHolder,
            web3.utils.toWei('1000000', 'ether')
        )

        // Add a new node type as admin
        const {
            name,
            tokenThreshold,
            timeThreshold,
            maxCount,
            rewards
        } = getNode()
        await dbetNode.addNode(
            name,
            tokenThreshold,
            timeThreshold,
            maxCount,
            rewards
        )

        // Approve tokens to be transferred on behalf of user from DBETNode and Quest contracts
        await token.approve(
            dbetNode.address,
            utils.MAX_VALUE,
            {
                from: nodeHolder
            }
        )
        await token.approve(
            quest.address,
            utils.MAX_VALUE,
            {
                from: nodeHolder
            }
        )
        // Create node of type ID 0
        await dbetNode.create(
            0,
            {
                from: nodeHolder
            }
        )
        // Move forward in time by `timeThreshold` to activate node
        await timeTravel(timeThreshold)

        // Add node quest as a node holder
        const {
            id,
            entryFee,
            prize,
            maxEntries
        } = getValidNodeQuestParams()

        // Add node quest
        await quest.addNodeQuest(
            0,
            id,
            entryFee,
            prize,
            maxEntries,
            {
                from: nodeHolder
            }
        )

        // Check if quest was successfully added
        const questData = await quest.quests(id)
        assert.equal(
            questData[4],
            true
        )
    })

    it('throws if non-quest address tries to call set prize fund in node wallet contract', async () => {
        const {
            id
        } = getValidNodeQuestParams()
        // Set prize fund in node wallet contract
        await utils.assertFail(
            nodeWallet.setPrizeFund(
                OFFERING_TYPE_QUEST,
                nodeId,
                id,
                web3.utils.toWei('1000', 'ether')
            )
        )
    })

    it('throws if non-quest address tries to call add quest entry fee in node wallet contract', async () => {
        const {
            id
        } = getValidNodeQuestParams()
        // Add quest entry fee in node wallet contract
        await utils.assertFail(
            nodeWallet.addEntryFee(
                OFFERING_TYPE_QUEST,
                nodeId,
                id,
                web3.utils.toWei('10', 'ether')
            )
        )
    })

    it('throws if non-quest address tries to call complete quest in node wallet contract', async () => {
        const {
            id
        } = getValidNodeQuestParams()
        // Complete quest in node wallet contract
        await utils.assertFail(
            nodeWallet.completeEvent(
                OFFERING_TYPE_QUEST,
                nodeId,
                id,
                web3.utils.toWei('10', 'ether')
            )
        )
    })

    it('throws if non-quest address tries to call claim refund in node wallet contract', async () => {
        const {
            id
        } = getValidNodeQuestParams()
        // Claim refund in node wallet contract
        await utils.assertFail(
            nodeWallet.claimRefund(
                OFFERING_TYPE_QUEST,
                nodeId,
                id,
                web3.utils.toWei('10', 'ether')
            )
        )
    })

    it('prize fund is set in node wallet contract on adding a quest in Quest contract', async () => {
        // Check if prize fund in node wallet for added quest is equal to (prize * maxEntries)
        const {
            prize,
            maxEntries,
            id
        } = getValidNodeQuestParams()

        const prizeFund = await nodeWallet.prizeFund(
            OFFERING_TYPE_QUEST,
            nodeId,
            id
        )

        assert.equal(
            new BigNumber(
                prizeFund
            ).isEqualTo(
                new BigNumber(prize).multipliedBy(maxEntries)
            ),
            true
        )
    })

    it('quest entry fee is added to total quest entry fees on pay for quest call in Quest contract', async () => {
        const {
            id,
            entryFee
        } = getValidNodeQuestParams()
        // Transfer DBETs to user1
        await token.transfer(
            user1,
            web3.utils.toWei('10000', 'ether')
        )
        // Approve quest contract to send user1's tokens
        await token.approve(
            quest.address,
            web3.utils.toWei('10000', 'ether'),
            {
                from: user1
            }
        )

        const prePayForQuestEntryFees = await nodeWallet.fees(
            OFFERING_TYPE_QUEST,
            nodeId,
            id
        )
        // Enter quest as user 1
        await quest.payForQuest(
            id,
            user1,
            {
                from: user1
            }
        )
        const postPayForQuestEntryFees = await nodeWallet.fees(
            OFFERING_TYPE_QUEST,
            nodeId,
            id
        )

        // Post-pay quest entry fees must be equal to pre-pay quest entry fees plus entry fee
        assert.equal(
            new BigNumber(postPayForQuestEntryFees).isEqualTo(
                new BigNumber(prePayForQuestEntryFees).plus(entryFee)
            ),
            true
        )
    })

    it('throws if node holder tries withdrawing entry fees that aren\'t completed', async () => {
        await utils.assertFail(
            nodeWallet.withdrawCompletedEntryFees(
                nodeId,
                {
                    from: nodeHolder
                }
            )
        )
    })

    it('quest entry fee is added to completed quest entry fees on set quest outcome call in Quest contract', async () => {
        const {
            id,
            entryFee
        } = getValidNodeQuestParams()

        const preQuestCompleteTotalCompletedQuestEntryFees = await nodeWallet.totalCompletedEntryFees(
            OFFERING_TYPE_QUEST,
            nodeId
        )
        // Set quest as success
        await quest.setQuestOutcome(
            id,
            user1,
            OUTCOME_SUCCESS
        )

        const postQuestCompleteTotalCompletedQuestEntryFees = await nodeWallet.totalCompletedEntryFees(
            OFFERING_TYPE_QUEST,
            nodeId
        )

        // Post-complete quest, total completed quest entry fees must be equal to pre-complete quest,
        // total completed quest entry fees plus entry fee
        assert.equal(
            new BigNumber(postQuestCompleteTotalCompletedQuestEntryFees).isEqualTo(
                new BigNumber(preQuestCompleteTotalCompletedQuestEntryFees).plus(entryFee)
            ),
            true
        )

    })

    it('quest entry fee is subtracted from total quest entry fees on claim refund call in Quest contract', async () => {
        const {
            id,
            entryFee
        } = getValidNodeQuestParams()
        // Transfer DBETs to user3
        await token.transfer(
            user3,
            web3.utils.toWei('10000', 'ether')
        )
        // Approve quest contract to send user3's tokens
        await token.approve(
            quest.address,
            web3.utils.toWei('10000', 'ether'),
            {
                from: user3
            }
        )
        const prePayForQuestEntryFees = await nodeWallet.fees(
            OFFERING_TYPE_QUEST,
            nodeId,
            id
        )
        // Enter quest as user 3
        await quest.payForQuest(
            id,
            user3,
            {
                from: user3
            }
        )
        const postPayForQuestEntryFees = await nodeWallet.fees(
            OFFERING_TYPE_QUEST,
            nodeId,
            id
        )
        // Post-pay quest entry fees must be equal to pre-pay quest entry fees plus entry fee
        assert.equal(
            new BigNumber(postPayForQuestEntryFees).isEqualTo(
                new BigNumber(prePayForQuestEntryFees).plus(entryFee)
            ),
            true
        )
        const preClaimTotalQuestEntryFees = await nodeWallet.totalEntryFees(
            OFFERING_TYPE_QUEST,
            nodeId
        )
        // Cancel quest entry for user3
        await quest.cancelQuestEntry(
            id,
            user3
        )
        const postClaimTotalQuestEntryFees = await nodeWallet.totalEntryFees(
            OFFERING_TYPE_QUEST,
            nodeId
        )
        // Post-claim total quest entry fees must be equal to pre-claim total quest entry fees minus entry fee
        assert.equal(
            new BigNumber(
                postClaimTotalQuestEntryFees
            ).isEqualTo(
                new BigNumber(preClaimTotalQuestEntryFees)
                    .minus(
                        entryFee
                    )
            ),
            true
        )
    })

    it('throws if non-node owner tries to withdraw completed quest entry fees in node wallet contract', async () => {
        await utils.assertFail(
            nodeWallet.withdrawCompletedEntryFees(
                nodeId,
                {
                    from: user3
                }
            )
        )
    })

    it('allows node holders to withdraw fees if they have a positive completed quest entry fee balance', async () => {
        const preWithdrawNodeHolderBalance = await token.balanceOf(
            nodeHolder
        )
        const preWithdrawTotalCompletedQuestEntryFees =
            await nodeWallet.totalCompletedEntryFees(
                OFFERING_TYPE_QUEST,
                nodeId
            )

        await nodeWallet.withdrawCompletedEntryFees(
            nodeId,
            {
                from: nodeHolder
            }
        )
        const postWithdrawNodeHolderBalance = await token.balanceOf(
            nodeHolder
        )
        const postWithdrawTotalCompletedQuestEntryFees =
            await nodeWallet.totalCompletedEntryFees(
                OFFERING_TYPE_QUEST,
                nodeId
            )

        // Post-withdraw node holder balance must be equal to pre-withdraw node holder balance plus
        // pre-withdraw total completed quest entry fees
        assert.equal(
            new BigNumber(
                postWithdrawNodeHolderBalance
            ).isEqualTo(
                new BigNumber(preWithdrawNodeHolderBalance)
                    .plus(preWithdrawTotalCompletedQuestEntryFees)
            ),
            true
        )

        // Post-withdraw total completed quest entry fees must be 0
        assert.equal(
            new BigNumber(
                postWithdrawTotalCompletedQuestEntryFees
            ).isEqualTo(0),
            true
        )
    })

})
