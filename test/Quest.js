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

})
