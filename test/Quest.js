const BigNumber = require('bignumber.js')
const timeTraveler = require('ganache-time-traveler')
const Web3 = require('web3')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

const OUTCOME_SUCCESS = 2
const OUTCOME_FAILED = 3
const OUTCOME_INVALID = 4

let admin,
    quest,
    token

let owner
let user1
let user2
let user3
let user4

const web3 = new Web3()

const timeTravel = async timeDiff => {
    await timeTraveler.advanceTime(timeDiff)
}

const getValidQuestParams = () => {
    const id = web3.utils.fromUtf8('123')
    const entryFee = web3.utils.toWei('100', 'ether')
    const prize = web3.utils.toWei('500', 'ether')

    return {
        id,
        entryFee,
        prize
    }
}

contract('Quest', accounts => {
    it('initializes quest contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        user4 = accounts[4]

        quest = await contracts.Quest.deployed()
        token = await contracts.DBETVETToken.deployed()
        admin = await contracts.Admin.deployed()

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
    })

    it('throws if non-admin adds quest', async () => {
        const {
            id,
            entryFee,
            prize
        } = getValidQuestParams()

        await utils.assertFail(
            quest.addQuest(
                id,
                entryFee,
                prize,
                {
                    from: user2
                }
            )
        )
    })

    it('throws if admin adds quest with invalid data', async () => {
        const {
            id,
            entryFee,
            prize
        } = getValidQuestParams()

        const invalidUint = 0
        const invalidBytes32 = web3.utils.fromUtf8(0)

        // Invalid id
        await utils.assertFail(
            quest.addQuest(
                invalidBytes32,
                entryFee,
                prize
            )
        )

        // Invalid entryFee
        await utils.assertFail(
            quest.addQuest(
                id,
                invalidUint,
                prize
            )
        )

        // Invalid prize
        await utils.assertFail(
            quest.addQuest(
                id,
                entryFee,
                invalidUint
            )
        )
    })

    it('allows admins to add quests', async () => {
        const {
            id,
            entryFee,
            prize
        } = getValidQuestParams()

        await quest.addQuest(
            id,
            entryFee,
            prize
        )

        const questData = await quest.quests(id)

        assert.equal(
            questData[4],
            true
        )
    })

    it('throws if admin adds quest with an existing id', async () => {
        const {
            id,
            entryFee,
            prize
        } = getValidQuestParams()

        await utils.assertFail(
            quest.addQuest(
                id,
                entryFee,
                prize
            )
        )
    })

    it('throws if user pays for non-existent quest id', async () => {
        await utils.assertFail(
            quest.payForQuest(
                web3.utils.fromUtf8('invalid'),
                user1,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if user pays for quest id without a sufficient balance and/or allowance', async () => {
        const {id} = getValidQuestParams()
        // Invalid balance
        await utils.assertFail(
            quest.payForQuest(
                id,
                user1,
                {
                    from: user1
                }
            )
        )

        // Transfer DBETs to user1
        await token.transfer(
            user1,
            web3.utils.toWei('10000', 'ether')
        )

        // Invalid allowance
        await utils.assertFail(
            quest.payForQuest(
                id,
                user1,
                {
                    from: user1
                }
            )
        )
    })

    it('allows user to pay for quest with a sufficient balance and allowance', async () => {
        // Approve quest contract to send user1's tokens
        await token.approve(
            quest.address,
            web3.utils.toWei('100000', 'ether'),
            {
                from: user1
            }
        )

        const {id} = getValidQuestParams()

        const {
            entryFee,
            prize
        } = (await quest.quests(id))

        console.log({
            entryFee: web3.utils.fromWei(entryFee.toString(), 'ether'),
            prize: web3.utils.fromWei(prize.toString(), 'ether')
        })

        // Pay for quest with sufficient allowance and balance
        await quest.payForQuest(
            id,
            user1,
            {
                from: user1
            }
        )

        // Check if user entry exists
        const userQuestEntry = await quest.userQuestEntries(
            user1,
            id,
            0
        )
        const questEntryStatus_started = 1
        assert.equal(
            userQuestEntry[1],
            questEntryStatus_started
        )
    })

    it('throws if user pays for quest id that has already been started', async () => {
        const {id} = getValidQuestParams()
        await utils.assertFail(
            quest.payForQuest(
                id,
                user1,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if non-admin cancels quest', async () => {
        const {id} = getValidQuestParams()
        await utils.assertFail(
            quest.cancelQuest(
                id,
                {
                    from: user2
                }
            )
        )
    })

    it('throws if non-admin sets quest outcome', async () => {
        const {id} = getValidQuestParams()
        await utils.assertFail(
            quest.setQuestOutcome(
                id,
                user1,
                OUTCOME_SUCCESS,
                {
                    from: user2
                }
            )
        )
    })

    it('throws if admin sets quest outcome with invalid outcome', async () => {
        const {id} = getValidQuestParams()

        await utils.assertFail(
            quest.setQuestOutcome(
                id,
                user1,
                OUTCOME_INVALID
            )
        )
    })

    it('throws if admin sets quest outcome with invalid user quest entry id/user', async () => {
        const {id} = getValidQuestParams()
        // Invalid id
        await utils.assertFail(
            quest.setQuestOutcome(
                web3.utils.fromUtf8('invalid'),
                user1,
                OUTCOME_SUCCESS
            )
        )

        // Invalid user
        await utils.assertFail(
            quest.setQuestOutcome(
                id,
                user2,
                OUTCOME_SUCCESS
            )
        )
    })

    it('throws if users claim refunds for non-cancelled quests', async () => {
        const {id} = getValidQuestParams()
        await utils.assertFail(
            quest.claimRefund(
                id,
                user1,
                {
                    from: user1
                }
            )
        )
    })

    it('allows admin to set quest outcome with valid values', async () => {
        const {id} = getValidQuestParams()

        const preSetOutcomeQuestEntryCount = await quest.userQuestEntryCount(user1, id)
        await quest.setQuestOutcome(
            id,
            user1,
            OUTCOME_SUCCESS
        )
        const postSetOutcomeQuestEntryCount = await quest.userQuestEntryCount(user1, id)

        const userQuestEntry = await quest.userQuestEntries(
            user1,
            id,
            0
        )
        const _userQuestEntry = await quest.userQuestEntries(
            user1,
            id,
            1
        )
        console.log({
            preSetOutcomeQuestEntryCount,
            postSetOutcomeQuestEntryCount,
            _userQuestEntry
        })
        assert.equal(
            new BigNumber(preSetOutcomeQuestEntryCount).plus(1).toFixed(),
            new BigNumber(postSetOutcomeQuestEntryCount).toFixed()
        )
        assert.equal(
            userQuestEntry[1],
            OUTCOME_SUCCESS
        )
    })

    it('throws if admin sets quest outcome for completed quest', async () => {
        const {id} = getValidQuestParams()
        await utils.assertFail(
            quest.setQuestOutcome(
                id,
                user1,
                OUTCOME_SUCCESS
            )
        )
    })

    it('allows users to re-pay for quest after completing a quest', async () => {
        const {
            id
        } = getValidQuestParams()

        const prePayQuestCount = (await quest.quests(id)).count

        // Pay for quest
        await quest.payForQuest(
            id,
            user1,
            {
                from: user1
            }
        )

        const postPayQuestCount = (await quest.quests(id)).count

        assert.equal(
            new BigNumber(prePayQuestCount).plus(1).toFixed(),
            new BigNumber(postPayQuestCount).toFixed()
        )
    })

    it('quest count increments on pay for quest', async () => {
        const {id} = getValidQuestParams()

        /** Pay for user3/user4 quest entries for next test cases **/
        // Transfer DBETs to user3
        await token.transfer(
            user3,
            web3.utils.toWei('10000', 'ether')
        )

        // Transfer DBETs to user4
        await token.transfer(
            user4,
            web3.utils.toWei('10000', 'ether')
        )

        // Approve quest contract to send user3's tokens
        await token.approve(
            quest.address,
            web3.utils.toWei('100000', 'ether'),
            {
                from: user3
            }
        )

        // Approve quest contract to send user4's tokens
        await token.approve(
            quest.address,
            web3.utils.toWei('100000', 'ether'),
            {
                from: user4
            }
        )

        const prePayQuestCount = (await quest.quests(id)).count
        // Pay for quest with sufficient allowance and balance as user3
        await quest.payForQuest(
            id,
            user3,
            {
                from: user3
            }
        )
        // Pay for quest with sufficient allowance and balance as user4
        await quest.payForQuest(
            id,
            user4,
            {
                from: user4
            }
        )
        const postPayQuestCount = (await quest.quests(id)).count

        assert.equal(
            new BigNumber(prePayQuestCount).plus(2).toFixed(),
            new BigNumber(postPayQuestCount).toFixed()
        )

    })

    it('throws if non-admins cancel quest entries', async () => {
        const {id} = getValidQuestParams()

        await utils.assertFail(
            quest.cancelQuestEntry(
                id,
                user3,
                {
                    from: user3
                }
            )
        )
    })

    it('allows admins to cancel quest entries with an active status', async () => {
        const {id} = getValidQuestParams()
        // Cancel quest entry for user 3
        await quest.cancelQuestEntry(
            id,
            user3
        )

        const questEntry = await quest.userQuestEntries(
            user3,
            id,
            0
        )

        const QUEST_ENTRY_STATUS_CANCELLED = 4

        // Quest status is cancelled
        assert.equal(
            questEntry[1],
            QUEST_ENTRY_STATUS_CANCELLED
        )

        // Quest must be refunded
        assert.equal(
            questEntry[2],
            true
        )
    })

    it('throws if admins cancel quest entries with a non-active status', async () => {
        const {id} = getValidQuestParams()
        await utils.assertFail(
            quest.cancelQuestEntry(
                id,
                user3
            )
        )
    })

    it('throws if users claim refunds for already claimed cancelled quest entries', async () => {
        const {id} = getValidQuestParams()
        await utils.assertFail(
            quest.claimRefundForEntry(
                id,
                user3,
                {
                    from: user3
                }
            )
        )
    })

    it('allows users to re-pay for quest after claiming refunds for a cancelled user quest entry', async () => {
        const {
            id
        } = getValidQuestParams()

        const prePayQuestCount = (await quest.quests(id)).count

        // Pay for quest
        await quest.payForQuest(
            id,
            user3,
            {
                from: user3
            }
        )

        const postPayQuestCount = (await quest.quests(id)).count

        assert.equal(
            new BigNumber(prePayQuestCount).plus(1).toFixed(),
            new BigNumber(postPayQuestCount).toFixed()
        )
    })

    it('allows admins to cancel quests with an active status', async () => {
        const {id} = getValidQuestParams()
        await quest.cancelQuest(
            id
        )
        const _quest = await quest.quests(id)
        const QUEST_STATUS_CANCELLED = 2
        assert.equal(
            _quest[4],
            QUEST_STATUS_CANCELLED
        )
    })

    it('throws if admin cancels quest with a non-active status', async () => {
        const {id} = getValidQuestParams()
        await utils.assertFail(
            quest.cancelQuest(
                id
            )
        )
    })

    it('throws if non-users claim refunds for cancelled quests', async () => {
        const {
            id
        } = getValidQuestParams()

        await utils.assertFail(
            quest.claimRefund(
                id,
                user4,
                {
                    from: user3
                }
            )
        )
    })

    it('allows users to claim refunds for cancelled quests', async () => {
        const {
            entryFee,
            id
        } = getValidQuestParams()

        const preRefundBalance = await token.balanceOf(user4)
        // Claim refund
        await quest.claimRefund(
            id,
            user4,
            {
                from: user4
            }
        )
        const postRefundBalance = await token.balanceOf(user4)
        assert.equal(
            new BigNumber(preRefundBalance).plus(entryFee).toFixed(),
            new BigNumber(postRefundBalance).toFixed()
        )

        const userQuestEntry = await quest.userQuestEntries(
            user4,
            id,
            0
        )
        assert.equal(
            userQuestEntry[2],
            true
        )
    })

    it('allows admins to claim refunds on behalf of users for cancelled quests', async () => {
        const {
            entryFee,
            id
        } = getValidQuestParams()

        const preRefundBalance = await token.balanceOf(user3)
        // Claim refund
        await quest.claimRefund(
            id,
            user3
        )
        const postRefundBalance = await token.balanceOf(user3)
        assert.equal(
            new BigNumber(preRefundBalance).plus(entryFee).toFixed(),
            new BigNumber(postRefundBalance).toFixed()
        )

        const userQuestEntry = await quest.userQuestEntries(
            user3,
            id,
            1
        )
        assert.equal(
            userQuestEntry[2],
            true
        )
    })

})
