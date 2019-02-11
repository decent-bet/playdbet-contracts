const Web3 = require('web3')

// Imports
const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let token,
    tournament

let owner
let user1
let user2

const timeTravel = async timeDiff => {
    await utils.timeTravel(timeDiff)
}

contract('Tournament', accounts => {
    it('initializes tournament contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        token = await contracts.DBETVETToken.deployed()
        tournament = await contracts.Tournament.deployed()
    })

})
