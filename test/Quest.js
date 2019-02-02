const Web3 = require('web3')

// Imports
const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let quest,
    token

let owner
let user1
let user2

const web3 = new Web3()

const timeTravel = async timeDiff => {
    await utils.timeTravel(timeDiff)
}

const getValidQuestParams = () => {
    const id = web3.utils.fromUtf8('123')
    const entryFee = web3.utils.toWei('100', 'ether')
    const timeToComplete = 60 * 60
    const prize = web3.utils.toWei('500', 'ether')

    return {
        id,
        entryFee,
        timeToComplete,
        prize
    }
}

contract('Options', accounts => {
    it('initializes quest contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        quest = await contracts.Quest.deployed()
        token = await contracts.DBETVETToken.deployed()
    })

    it('throws if non-owners add an admin', async () => {
        await utils.assertFail(
            quest.addAdmin(user2, {from: user1})
        )
    })

    it('allows owners to add admins', async () => {
        await quest.addAdmin(user2, {from: owner})
        const isUser2Admin = await quest.admins(user2)
        assert.equal(
            isUser2Admin,
            true
        )
    })

    it('throws if non-owners remove admins', async () => {
        await utils.assertFail(
            quest.removeAdmin(user2, {from: user1})
        )
    })

    it('allows owners to remove admins', async () => {
        await quest.removeAdmin(user2, {from: owner})

        const isUser2Admin = await quest.admins(user2)

        assert.equal(
            isUser2Admin,
            false
        )
    })

    it('throws if non-owner sets platform wallet', async () => {
        await utils.assertFail(
            quest.setPlatformWallet(
                user2,
                {
                    from: user1
                }
            )
        )
    })

    it('allows owner to set platform wallet', async () => {
        await quest.setPlatformWallet(
            user2,
            {
                from: owner
            }
        )

        const platformWallet = await quest.platformWallet()
        assert.equal(
            platformWallet,
            user2
        )
    })

    it('throws if non-admin adds quest', async () => {
        const {
            id,
            entryFee,
            timeToComplete,
            prize
        } = getValidQuestParams()

        await utils.assertFail(
            quest.addQuest(
                id,
                entryFee,
                timeToComplete,
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
            timeToComplete,
            prize
        } = getValidQuestParams()

        const invalidValue = 0

        // Invalid id
        await utils.assertFail(
            quest.addQuest(
                invalidValue,
                entryFee,
                timeToComplete,
                prize
            )
        )

        // Invalid entryFee
        await utils.assertFail(
            quest.addQuest(
                id,
                invalidValue,
                timeToComplete,
                prize
            )
        )

        // Invalid timeToComplete
        await utils.assertFail(
            quest.addQuest(
                id,
                entryFee,
                invalidValue,
                prize
            )
        )

        // Invalid prize
        await utils.assertFail(
            quest.addQuest(
                id,
                entryFee,
                timeToComplete,
                invalidValue
            )
        )
    })

    it('allows admins to add quests', async () => {
        const {
            id,
            entryFee,
            timeToComplete,
            prize
        } = getValidQuestParams()

        await quest.addQuest(
            id,
            entryFee,
            timeToComplete,
            prize
        )

        const questData = await quest.quests(id)

        assert.equal(
            questData[3],
            true
        )
    })

    it('throws if admin adds quest with an existing id', async () => {
        const {
            id,
            entryFee,
            timeToComplete,
            prize
        } = getValidQuestParams()

        await utils.assertFail(
            quest.addQuest(
                id,
                entryFee,
                timeToComplete,
                prize
            )
        )
    })

})
