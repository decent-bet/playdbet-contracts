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

})
