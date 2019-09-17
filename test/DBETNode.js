const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let admin
let dbetNode
let token

let owner
let user1
let user2

const web3 = utils.getWeb3()

const _getNodeType = () => {
    return {
        name: 'Thunder',
        tokenThreshold: web3.utils.toWei('100000', 'ether'), // 100k DBETs
        timeThreshold: 86400 * 7 // 1 week
    }
}

contract('DBETNode', accounts => {
    it('initializes DBETNode contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        admin = await contracts.Admin.deployed()
        dbetNode = await contracts.DBETNode.deployed()
        token = await contracts.DBETVETToken.deployed()
    })

    it('does not allow non-admins to add a new node type', async () => {
        const {
            name,
            tokenThreshold,
            timeThreshold
        } = _getNodeType()

        await utils.assertFail(
            dbetNode.addType(
                name,
                tokenThreshold,
                timeThreshold,
                {
                    from: user1
                }
            )
        )
    })

    it('allows admins to add new node types', async () => {
        const {
            name,
            tokenThreshold,
            timeThreshold
        } = _getNodeType()

        await dbetNode.addType(
            name,
            tokenThreshold,
            timeThreshold
        )

        const nodeType = await dbetNode.nodeTypes(0)

        assert.equal(
            name,
            nodeType.name
        )
    })

    it('does not allow users without an approved DBET balance to create a node', async () => {
        const {
            tokenThreshold
        } = _getNodeType()

        const _assertFailCreateNode = () => {
            utils.assertFail(
                dbetNode.create(
                    0,
                    {
                        from: user1
                    }
                )
            )
        }
        await _assertFailCreateNode()

        // Transfer tokens to user1
        await token.transfer(
            user1,
            tokenThreshold
        )
        // Fails since balance hasn't been approved to be spent
        await _assertFailCreateNode()
    })

    it('allows users with an approved DBET balance to create a node', async () => {
        // Approve tokens to be transferred on behalf of user from DBETNode contract
        await token.approve(
            dbetNode.address,
            utils.MAX_VALUE,
            {
                from: user1
            }
        )
        // Create node of type ID 0
        await dbetNode.create(
            0,
            {
                from: user1
            }
        )
    })

    it('does not allow users to destroy invalid nodes', async () => {

    })

    it('allows users to destroy valid nodes owned by them', async () => {

    })

    it('does not allow ', async () => {

    })

    it('', async () => {

    })

    it('', async () => {

    })

    it('', async () => {

    })

    it('', async () => {

    })
})
