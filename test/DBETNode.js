const BigNumber = require('bignumber.js')
const timeTraveler = require('ganache-time-traveler')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')
const {
    getHouseNode,
    getUpgradedNode
} = require('./utils/nodes')

let admin
let dbetNode
let token

let owner
let user1
let user2

let NODE_ID_HOUSE = 1
let NODE_ID_UPGRADED = 2

let USER_NODE_HOUSE_ID_1 = 1
let USER_NODE_HOUSE_ID_2 = 2

const web3 = utils.getWeb3()

const timeTravel = async timeDiff => {
    await timeTraveler.advanceTime(timeDiff)
    await timeTraveler.advanceBlock()
}

const getNodeUpgradeTokenRequirement = () => {
    const tier1TokenThreshold = getHouseNode().tokenThreshold
    const tier2TokenThreshold = getUpgradedNode().tokenThreshold
    return new BigNumber(tier2TokenThreshold).minus(tier1TokenThreshold).toFixed()
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
            rewards,
            entryFeeDiscount,
            increasedPrizePayout,
            nodeType
        } = getHouseNode()

        await utils.assertFail(
            dbetNode.addNode(
                name,
                tokenThreshold,
                timeThreshold,
                maxCount,
                rewards,
                entryFeeDiscount,
                increasedPrizePayout,
                nodeType,
                {
                    from: user1
                }
            )
        )
    })

    it('allows admins to add new node types', async () => {
        const addNode = async (node, index) => {
            const {
                name,
                tokenThreshold,
                timeThreshold,
                maxCount,
                rewards,
                entryFeeDiscount,
                increasedPrizePayout,
                nodeType
            } = node

            await dbetNode.addNode(
                name,
                tokenThreshold,
                timeThreshold,
                maxCount,
                rewards,
                entryFeeDiscount,
                increasedPrizePayout,
                nodeType
            )

            const _node = await dbetNode.nodes(index)

            assert.equal(
                name,
                _node.name
            )
        }

        await addNode(getHouseNode(), NODE_ID_HOUSE)
        await addNode(getUpgradedNode(), NODE_ID_UPGRADED)
    })

    it('does not allow users without an approved DBET balance to create a node', async () => {
        const {
            tokenThreshold
        } = getHouseNode()

        const _assertFailCreateNode = () => {
            utils.assertFail(
                dbetNode.create(
                    NODE_ID_HOUSE,
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
        // Create node of type ID 1
        await dbetNode.create(
            NODE_ID_HOUSE,
            {
                from: user1
            }
        )


        // Check if user is owner of node
        const userNode = await dbetNode.userNodes(USER_NODE_HOUSE_ID_1)
        console.log('user node', userNode, userNode.owner, user1)
        assert.equal(userNode.owner, user1)

        // Node must not be activated
        assert.equal(await dbetNode.isUserNodeActivated(USER_NODE_HOUSE_ID_1), false)

        // Activate node
        await timeTravel(7 * 86400)

        // Node must be activated
        assert.equal(await dbetNode.isUserNodeActivated(USER_NODE_HOUSE_ID_1), true)
    })

    it('does not allow users with an existing node and a valid approved balance to create a new node', async () => {
        const {
            tokenThreshold
        } = getUpgradedNode()

        // Transfer `tokenThreshold` for upgraded node to user1
        await token.transfer(
            user1,
            tokenThreshold
        )
        // Node of same type
        await utils.assertFail(
            dbetNode.create(
                NODE_ID_HOUSE,
                {
                    from: user1
                }
            )
        )

        // Node of different type
        await utils.assertFail(
            dbetNode.create(
                NODE_ID_UPGRADED,
                {
                    from: user1
                }
            )
        )

        // Transfer `tokenThreshold` for upgraded node back from user1
        await token.transfer(
            owner,
            tokenThreshold,
            {
                from: user1
            }
        )
    })

    it('does not allow users without a valid approved balance to upgrade a node', async () => {
        await utils.assertFail(
            dbetNode.upgrade(
                NODE_ID_HOUSE,
                NODE_ID_UPGRADED,
                {
                    from: user1
                }
            )
        )
    })

    it('does not allow users without an existing node to upgrade a node', async () => {
        const tokenRequirement = getNodeUpgradeTokenRequirement()
        // Transfer tokens to user2
        await token.transfer(
            user1,
            tokenRequirement
        )
        // Approve tokens to be transferred on behalf of user from DBETNode contract
        await token.approve(
            dbetNode.address,
            utils.MAX_VALUE,
            {
                from: user2
            }
        )
        // Not owned by user
        await utils.assertFail(
            dbetNode.upgrade(
                NODE_ID_HOUSE,
                NODE_ID_UPGRADED,
                {
                    from: user2
                }
            )
        )
    })

    it('allows users to upgrade a node with an existing node', async () => {
        const tokenRequirement = getNodeUpgradeTokenRequirement()
        const preUpgradeBalance = await token.balanceOf(user1)
        // Upgrade node to Tier II
        await dbetNode.upgrade(
            NODE_ID_HOUSE,
            NODE_ID_UPGRADED,
            {
                from: user1
            }
        )
        const postUpgradeBalance = await token.balanceOf(user1)

        console.log(
            'pre/post upgrade balances',
            web3.utils.fromWei(preUpgradeBalance.toString(), 'ether'),
            web3.utils.fromWei(postUpgradeBalance.toString(), 'ether'),
            web3.utils.fromWei(tokenRequirement, 'ether')
        )
        // Token balance must be 0 now
        assert.equal(
            new BigNumber(preUpgradeBalance)
                .minus(postUpgradeBalance)
                .isEqualTo(tokenRequirement),
            true
        )
        const userNode = await dbetNode.userNodes(USER_NODE_HOUSE_ID_1)
        // Node must be owned by user
        assert.equal(userNode.owner, user1)
        // Node must be of type 2
        assert.equal(userNode.node, NODE_ID_UPGRADED)
        // Node must not be activated
        assert.equal(await dbetNode.isUserNodeActivated(USER_NODE_HOUSE_ID_1), false)
        // Activate node
        await timeTravel(7 * 86400)
        // Node must be activated
        assert.equal(await dbetNode.isUserNodeActivated(USER_NODE_HOUSE_ID_1), true)
    })

    it('does not allow users to destroy invalid nodes', async () => {
        // Invalid ID
        await utils.assertFail(
            dbetNode.destroy(
                0
            )
        )

        // Not owned by user
        await utils.assertFail(
            dbetNode.destroy(
                USER_NODE_HOUSE_ID_1,
                {
                    from: user2
                }
            )
        )
    })

    it('allows users to destroy valid nodes owned by them', async () => {
        const {
            tokenThreshold
        } = getUpgradedNode()
        const preDestroyBalance = await token.balanceOf(user1)
        await dbetNode.destroy(
            USER_NODE_HOUSE_ID_1,
            {
                from: user1
            }
        )

        const node = await dbetNode.userNodes(USER_NODE_HOUSE_ID_1)
        assert.notEqual(node.destroyTime, '0')

        const postDestroyBalance = await token.balanceOf(user1)

        assert.equal(
            new BigNumber(postDestroyBalance).minus(preDestroyBalance).toFixed(),
            new BigNumber(tokenThreshold).toFixed()
        )
    })

    it('nodes are not active if they don\'t meet time threshold', async () => {
        // Create node of type ID 1
        await dbetNode.create(
            NODE_ID_HOUSE,
            {
                from: user1
            }
        )

        const isUserNodeActivated = await dbetNode.isUserNodeActivated(USER_NODE_HOUSE_ID_2)

        assert.equal(
            isUserNodeActivated,
            false
        )
    })

    it('nodes are active if they meet time threshold', async () => {
        const {
            timeThreshold
        } = getHouseNode()
        await timeTravel(timeThreshold)

        const isUserNodeActivated = await dbetNode.isUserNodeActivated(USER_NODE_HOUSE_ID_2)

        assert.equal(
            isUserNodeActivated,
            true
        )
    })

    it('does not allow non-admins to deprecate valid nodes', async () => {
        await utils.assertFail(
            dbetNode.deprecateNode(
                NODE_ID_UPGRADED,
                {
                    from: user1
                }
            )
        )
    })

    it('does not allow admins to deprecate invalid nodes', async () => {
        await utils.assertFail(
            dbetNode.deprecateNode(
                0,
                {
                    from: user1
                }
            )
        )
    })

    it('allows admins to deprecate valid nodes', async () => {
        await dbetNode.deprecateNode(
            NODE_ID_UPGRADED
        )

        const node = await dbetNode.nodes(NODE_ID_UPGRADED)
        const {deprecated} = node
        assert.equal(
            deprecated,
            true
        )
    })

    it('throws if admins deprecate an already deprecated node', async () => {
        await utils.assertFail(
            dbetNode.deprecateNode(
                NODE_ID_UPGRADED
            )
        )
    })

})
