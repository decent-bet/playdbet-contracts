const BigNumber = require('bignumber.js')
const timeTraveler = require('ganache-time-traveler')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let admin
let dbetNode
let token

let owner
let user1
let user2

const web3 = utils.getWeb3()

const timeTravel = async timeDiff => {
    await timeTraveler.advanceTime(timeDiff)
}

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
        // Invalid ID
        await utils.assertFail(
            dbetNode.destroy(
                1
            )
        )

        // Not owned by user
        await utils.assertFail(
            dbetNode.destroy(
                0,
                {
                    from: user2
                }
            )
        )
    })

    it('allows users to destroy valid nodes owned by them', async () => {
        const {
            tokenThreshold
        } = _getNodeType()
        const preDestroyBalance = await token.balanceOf(user1)
        await dbetNode.destroy(
            0,
            {
                from: user1
            }
        )

        const node = await dbetNode.nodes(0)
        assert.notEqual(node.destroyTime, '0')

        const postDestroyBalance = await token.balanceOf(user1)

        assert.equal(
            new BigNumber(postDestroyBalance).minus(preDestroyBalance).toFixed(),
            new BigNumber(tokenThreshold).toFixed()
        )
    })

    it('nodes are not active if they don\'t meet time threshold', async () => {
        // Create node of type ID 0
        await dbetNode.create(
            0,
            {
                from: user1
            }
        )

        const isNodeActivated = await dbetNode.isNodeActivated(1)

        assert.equal(
            isNodeActivated,
            false
        )
    })

    it('nodes are active if they meet time threshold', async () => {
        await timeTravel(86400 * 7)

        const isNodeActivated = await dbetNode.isNodeActivated(1)

        assert.equal(
            isNodeActivated,
            true
        )
    })

})
