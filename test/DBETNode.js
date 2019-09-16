const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let admin

let owner
let user1
let user2

contract('DBETNode', accounts => {
    it('initializes DBETNode contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        admin = await contracts.DBETNode.deployed()
    })
})
