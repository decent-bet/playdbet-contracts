const BigNumber = require('bignumber.js')
const timeTraveler = require('ganache-time-traveler')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')
const {
    getNode
} = require('./utils/nodes')

let admin
let dbetNode
let nodeWallet
let quest
let token

let owner
let user1
let user2

const web3 = utils.getWeb3()

const timeTravel = async timeDiff => {
    await timeTraveler.advanceTime(timeDiff)
}

contract('NodeWallet', accounts => {
    it('initializes NodeWallet contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        admin = await contracts.Admin.deployed()
        dbetNode = await contracts.DBETNode.deployed()
        nodeWallet = await contracts.NodeWallet.deployed()
        quest = await contracts.Quest.deployed()
        token = await contracts.DBETVETToken.deployed()
    })

    it('throws if non-quest address tries to set prize fund in node wallet contract', async () => {

    })

    it('throws if non-quest address tries to add quest entry fee in node wallet contract', async () => {

    })

    it('throws if non-quest address tries to complete quest in node wallet contract', async () => {

    })

    it('throws if non-quest address tries to claim refund in node wallet contract', async () => {

    })

    it('throws if non-node owner tries to withdraw completed quest entry fees in node wallet contract', async () => {

    })

    it('prize fund is set in node wallet contract on adding a quest in Quest contract', async () => {

    })

    it('quest entry fee is added to total quest entry fees on pay for quest call in Quest contract', async () => {

    })

    it('quest entry fee is added to completed quest entry fees on set quest outcome call in Quest contract', async () => {

    })

    it('quest entry fee is subtracted from total quest entry fees on claim refund call in Quest contract', async () => {

    })

    it('throws if non-node holders try to withdraw complete fees from Node Wallet contract', async () => {

    })

    it('allows node holders to withdraw fees if they have a positive completed quest entry fee balance', async () => {

    })

})
