const BigNumber = require('bignumber.js')
const timeTraveler = require('ganache-time-traveler')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')
const {
    getNode
} = require('./utils/nodes')

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
            timeThreshold,
            maxCount,
            rewards
        } = getNode()

        await utils.assertFail(
            dbetNode.addNode(
                name,
                tokenThreshold,
                timeThreshold,
                maxCount,
                rewards,
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

        const nodeType = await dbetNode.nodes(0)

        assert.equal(
            name,
            nodeType.name
        )
    })

    it('does not allow users without an approved DBET balance to create a node', async () => {
        const {
            tokenThreshold
        } = getNode()

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
        } = getNode()
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

        const isUserNodeActivated = await dbetNode.isUserNodeActivated(1)

        assert.equal(
            isUserNodeActivated,
            false
        )
    })

    it('nodes are active if they meet time threshold', async () => {
        const {
            timeThreshold
        } = getNode()
        await timeTravel(timeThreshold)

        const isUserNodeActivated = await dbetNode.isUserNodeActivated(1)

        assert.equal(
            isUserNodeActivated,
            true
        )
    })

})
