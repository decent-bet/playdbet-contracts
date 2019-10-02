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

const REWARD_INCREASED_PRIZE_PAYOUTS = 0
const REWARD_INCREASED_REFER_A_FRIEND = 1
const REWARD_CREATE_QUEST = 2
const REWARD_CREATE_PRIVATE_QUEST = 3
const REWARD_CREATE_WHITELIST_QUEST = 4
const REWARD_CREATE_TOURNAMENT = 5

const rewards = [
    REWARD_INCREASED_PRIZE_PAYOUTS,
    REWARD_INCREASED_REFER_A_FRIEND,
    REWARD_CREATE_QUEST,
    REWARD_CREATE_PRIVATE_QUEST,
    REWARD_CREATE_WHITELIST_QUEST,
    REWARD_CREATE_TOURNAMENT
]

const timeTravel = async timeDiff => {
    await timeTraveler.advanceTime(timeDiff)
}

const _getNode = () => {
    return {
        name: 'House',
        tokenThreshold: web3.utils.toWei('100000', 'ether'), // 100k DBETs
        timeThreshold: 86400 * 7, // 1 week
        maxCount: 10,
        rewards
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
            timeThreshold,
            maxCount,
            rewards
        } = _getNode()

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
        } = _getNode()

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
        } = _getNode()

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
        } = _getNode()
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
        await timeTravel(86400 * 7)

        const isUserNodeActivated = await dbetNode.isUserNodeActivated(1)

        assert.equal(
            isUserNodeActivated,
            true
        )
    })

})
