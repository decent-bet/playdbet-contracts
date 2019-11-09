const BigNumber = require('bignumber.js')
const timeTraveler = require('ganache-time-traveler')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')
const {
    getNode,
    getValidNodeQuestParams
} = require('./utils/nodes')
const {
    PRIZE_TYPE_WINNER_TAKE_ALL,
    PRIZE_TYPE_FIFTY_FIFTY,
    getValidPrizeTable,
    getValidTournamentParams,
    getValidTournamentCompletionParams,
    assertStandardClaimCalculations,
    assertWinnerTakeAllClaimCalculations,
    assertFiftyFiftyClaimCalculations
} = require('./utils/tournament')

let admin
let dbetNode
let nodeWallet
let quest
let token
let tournament

let owner
let user1
let user2
let user3
let nodeHolder

let prizeTableId
let standardTournamentId

const web3 = utils.getWeb3()
const nodeId = 0

const OUTCOME_SUCCESS = 2
const OUTCOME_FAILED = 3
const OUTCOME_INVALID = 4

const timeTravel = async timeDiff => {
    await timeTraveler.advanceTime(timeDiff)
}

contract('NodeWallet', accounts => {
    it('initializes NodeWallet contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        nodeHolder = accounts[4]

        admin = await contracts.Admin.deployed()
        dbetNode = await contracts.DBETNode.deployed()
        quest = await contracts.Quest.deployed()
        token = await contracts.DBETVETToken.deployed()
        tournament = await contracts.Tournament.deployed()

        nodeWallet = await contracts.NodeWallet.at(
            await dbetNode.nodeWallet()
        )

        // Set platform wallet address in admin
        await admin.setPlatformWallet(
            user2,
            {
                from: owner
            }
        )

        const platformWallet = await admin.platformWallet()
        assert.equal(
            platformWallet,
            user2
        )

        // Approve platform wallet to transfer DBETs for prizes
        await token.approve(
            quest.address,
            web3.utils.toWei('1000000000', 'ether'),
            {
                from: user2
            }
        )

        // Transfer DBETs to platform wallet
        await token.transfer(
            user2,
            web3.utils.toWei('1000000', 'ether')
        )

        // Transfer DBETs to node holder
        await token.transfer(
            nodeHolder,
            web3.utils.toWei('1000000', 'ether')
        )

        // Add a new node type as admin
        const {
            name,
            tokenThreshold,
            timeThreshold,
            maxCount,
            rewards,
            entryFeeDiscount
        } = getNode()
        await dbetNode.addNode(
            name,
            tokenThreshold,
            timeThreshold,
            maxCount,
            rewards,
            entryFeeDiscount
        )

        // Approve tokens to be transferred on behalf of user from DBETNode and Quest contracts
        await token.approve(
            dbetNode.address,
            utils.MAX_VALUE,
            {
                from: nodeHolder
            }
        )
        await token.approve(
            quest.address,
            utils.MAX_VALUE,
            {
                from: nodeHolder
            }
        )
        // Create node of type ID 0
        await dbetNode.create(
            0,
            {
                from: nodeHolder
            }
        )
        // Move forward in time by `timeThreshold` to activate node
        await timeTravel(timeThreshold)

        // Add node quest as a node holder
        const {
            id,
            entryFee,
            prize,
            maxEntries
        } = getValidNodeQuestParams()

        // Add node quest
        await quest.addNodeQuest(
            0,
            id,
            entryFee,
            prize,
            maxEntries,
            {
                from: nodeHolder
            }
        )

        // Check if quest was successfully added
        const questData = await quest.quests(id)
        assert.equal(
            questData[4],
            true
        )
    })

    it('throws if non-quest address tries to call set prize fund in node wallet contract', async () => {
        const {
            id
        } = getValidNodeQuestParams()
        // Set prize fund in node wallet contract
        await utils.assertFail(
            nodeWallet.setPrizeFund(
                nodeId,
                id,
                web3.utils.toWei('1000', 'ether')
            )
        )
    })

    it('throws if non-quest address tries to call add quest entry fee in node wallet contract', async () => {
        const {
            id
        } = getValidNodeQuestParams()
        // Add quest entry fee in node wallet contract
        await utils.assertFail(
            nodeWallet.addQuestEntryFee(
                nodeId,
                id,
                web3.utils.toWei('10', 'ether')
            )
        )
    })

    it('throws if non-quest address tries to call complete quest in node wallet contract', async () => {
        const {
            id
        } = getValidNodeQuestParams()
        // Complete quest in node wallet contract
        await utils.assertFail(
            nodeWallet.completeQuest(
                nodeId,
                id,
                web3.utils.toWei('10', 'ether')
            )
        )
    })

    it('throws if non-quest address tries to call claim refund in node wallet contract', async () => {
        const {
            id
        } = getValidNodeQuestParams()
        // Claim refund in node wallet contract
        await utils.assertFail(
            nodeWallet.claimRefund(
                nodeId,
                id,
                web3.utils.toWei('10', 'ether')
            )
        )
    })

    it('prize fund is set in node wallet contract on adding a quest in Quest contract', async () => {
        // Check if prize fund in node wallet for added quest is equal to (prize * maxEntries)
        const {
            prize,
            maxEntries,
            id
        } = getValidNodeQuestParams()

        const prizeFund = await nodeWallet.prizeFund(nodeId, id)

        assert.equal(
            new BigNumber(
                prizeFund
            ).isEqualTo(
                new BigNumber(prize).multipliedBy(maxEntries)
            ),
            true
        )
    })

    it('quest entry fee is added to total quest entry fees on pay for quest call in Quest contract', async () => {
        const {
            id,
            entryFee
        } = getValidNodeQuestParams()
        // Transfer DBETs to user1
        await token.transfer(
            user1,
            web3.utils.toWei('10000', 'ether')
        )
        // Approve quest contract to send user1's tokens
        await token.approve(
            quest.address,
            web3.utils.toWei('10000', 'ether'),
            {
                from: user1
            }
        )

        const prePayForQuestEntryFees = await nodeWallet.questFees(
            nodeId,
            id
        )
        // Enter quest as user 1
        await quest.payForQuest(
            id,
            user1,
            {
                from: user1
            }
        )
        const postPayForQuestEntryFees = await nodeWallet.questFees(
            nodeId,
            id
        )

        // Post-pay quest entry fees must be equal to pre-pay quest entry fees plus entry fee
        assert.equal(
            new BigNumber(postPayForQuestEntryFees).isEqualTo(
                new BigNumber(prePayForQuestEntryFees).plus(entryFee)
            ),
            true
        )
    })

    it('throws if node holder tries withdrawing entry fees that aren\'t completed', async () => {
        await utils.assertFail(
            nodeWallet.withdrawCompletedQuestEntryFees(
                nodeId,
                {
                    from: nodeHolder
                }
            )
        )
    })

    it('quest entry fee is added to completed quest entry fees on set quest outcome call in Quest contract', async () => {
        const {
            id,
            entryFee
        } = getValidNodeQuestParams()

        const preQuestCompleteTotalCompletedQuestEntryFees = await nodeWallet.totalCompletedQuestEntryFees(
            nodeId
        )
        // Set quest as success
        await quest.setQuestOutcome(
            id,
            user1,
            OUTCOME_SUCCESS
        )

        const postQuestCompleteTotalCompletedQuestEntryFees = await nodeWallet.totalCompletedQuestEntryFees(
            nodeId
        )

        // Post-complete quest, total completed quest entry fees must be equal to pre-complete quest,
        // total completed quest entry fees plus entry fee
        assert.equal(
            new BigNumber(postQuestCompleteTotalCompletedQuestEntryFees).isEqualTo(
                new BigNumber(preQuestCompleteTotalCompletedQuestEntryFees).plus(entryFee)
            ),
            true
        )
    })

    it('quest entry fee is subtracted from total quest entry fees on claim refund call in Quest contract', async () => {
        const {
            id,
            entryFee
        } = getValidNodeQuestParams()
        // Transfer DBETs to user3
        await token.transfer(
            user3,
            web3.utils.toWei('10000', 'ether')
        )
        // Approve quest contract to send user3's tokens
        await token.approve(
            quest.address,
            web3.utils.toWei('10000', 'ether'),
            {
                from: user3
            }
        )
        const prePayForQuestEntryFees = await nodeWallet.questFees(
            nodeId,
            id
        )
        // Enter quest as user 3
        await quest.payForQuest(
            id,
            user3,
            {
                from: user3
            }
        )
        const postPayForQuestEntryFees = await nodeWallet.questFees(
            nodeId,
            id
        )
        // Post-pay quest entry fees must be equal to pre-pay quest entry fees plus entry fee
        assert.equal(
            new BigNumber(postPayForQuestEntryFees).isEqualTo(
                new BigNumber(prePayForQuestEntryFees).plus(entryFee)
            ),
            true
        )
        const preClaimTotalQuestEntryFees = await nodeWallet.totalQuestEntryFees(
            nodeId
        )
        // Cancel quest entry for user3
        await quest.cancelQuestEntry(
            id,
            user3
        )
        const postClaimTotalQuestEntryFees = await nodeWallet.totalQuestEntryFees(
            nodeId
        )

        // Post-claim total quest entry fees must be equal to pre-claim total quest entry fees minus entry fee
        assert.equal(
            new BigNumber(
                postClaimTotalQuestEntryFees
            ).isEqualTo(
                new BigNumber(preClaimTotalQuestEntryFees)
                    .minus(
                        entryFee
                    )
            ),
            true
        )
    })

    it('throws if non-node owner tries to withdraw completed quest entry fees in node wallet contract', async () => {
        await utils.assertFail(
            nodeWallet.withdrawCompletedQuestEntryFees(
                nodeId,
                {
                    from: user3
                }
            )
        )
    })

    it('allows node holders to withdraw fees if they have a positive completed quest entry fee balance', async () => {
        const preWithdrawNodeHolderBalance = await token.balanceOf(
            nodeHolder
        )
        const preWithdrawTotalCompletedQuestEntryFees =
            await nodeWallet.totalCompletedQuestEntryFees(nodeId)

        await nodeWallet.withdrawCompletedQuestEntryFees(
            nodeId,
            {
                from: nodeHolder
            }
        )
        const postWithdrawNodeHolderBalance = await token.balanceOf(
            nodeHolder
        )
        const postWithdrawTotalCompletedQuestEntryFees =
            await nodeWallet.totalCompletedQuestEntryFees(nodeId)

        // Post-withdraw node holder balance must be equal to pre-withdraw node holder balance plus
        // pre-withdraw total completed quest entry fees
        assert.equal(
            new BigNumber(
                postWithdrawNodeHolderBalance
            ).isEqualTo(
                new BigNumber(preWithdrawNodeHolderBalance)
                    .plus(preWithdrawTotalCompletedQuestEntryFees)
            ),
            true
        )

        // Post-withdraw total completed quest entry fees must be 0
        assert.equal(
            new BigNumber(
                postWithdrawTotalCompletedQuestEntryFees
            ).isEqualTo(0),
            true
        )
    })

    it('rake fee is added to total rake fee and tournament rake fee in node wallet contract on completing a tournament', async () => {
        // Add prize table
        const prizeTable = getValidPrizeTable()
        const tx = await tournament.createPrizeTable(
            prizeTable,
            {
                from: owner
            }
        )
        prizeTableId = tx.logs[0].args.id
        const prizeTableCount = await tournament.prizeTableCount()
        assert.equal(
            prizeTableCount.toString(),
            '1'
        )

        // Create node tournament
        const createNodeTournament = async (
            _entryLimit,
            _tournamentCountAtCreation
        ) => {
            const {
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType
            } = getValidTournamentParams(_entryLimit)

            const tx = await tournament.createNodeTournament(
                nodeId,
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: nodeHolder
                }
            )

            let tournamentId = tx.logs[0].args.id
            let tournamentCountAtCreation = tx.logs[0].args.count

            assert.equal(
                tournamentCountAtCreation,
                _tournamentCountAtCreation
            )

            return tournamentId
        }

        // Standard tournaments
        standardTournamentId = await createNodeTournament(
            5,
            0
        )

        const tokenAmount = web3.utils.toWei('100000', 'ether')
        // Approve tokens for transfer for user1
        await token.approve(
            tournament.address,
            tokenAmount,
            {
                from: user1
            }
        )
        // Approve tokens for transfer for user2
        await token.approve(
            tournament.address,
            tokenAmount,
            {
                from: user2
            }
        )
        const enterTournament = async (
            user,
            tournamentId
        ) => {
            const preEnterTournamentUserBalance =
                await token.balanceOf(user)
            const tx = await tournament.enterTournament(
                tournamentId,
                {
                    from: user
                }
            )
            const postEnterTournamentUserBalance =
                await token.balanceOf(user)

            console.log(
                'Tournament', tournamentId,
                'User', user,
                web3.utils.fromWei(preEnterTournamentUserBalance.toString(), 'ether'),
                web3.utils.fromWei(postEnterTournamentUserBalance.toString(), 'ether')
            )

            assert.equal(
                tx.logs[0].args.id,
                tournamentId
            )
        }
        // User 1 enters tournament
        await enterTournament(
            user1,
            standardTournamentId
        )
        // User 2 enters tournament
        await enterTournament(
            user2,
            standardTournamentId
        )

        const finalStandings = [[0], [1]]
        const uniqueFinalStandings = 2

        // Pre-completion rake fees
        const preCompleteTournamentRakeFees = await nodeWallet.rakeFees(
            nodeId,
            standardTournamentId
        )
        const preCompleteTournamentTotalRakeFees = await nodeWallet.totalRakeFees(
            nodeId
        )
        // Complete tournament
        const completeTournamentTx = await tournament.completeTournament(
            standardTournamentId,
            finalStandings,
            uniqueFinalStandings,
            {
                from: owner
            }
        )
        assert.equal(
            completeTournamentTx.logs[0].args.id,
            standardTournamentId
        )
        // Post-completion rake fees
        const postCompleteTournamentRakeFees = await nodeWallet.rakeFees(
            nodeId,
            standardTournamentId
        )
        const postCompleteTournamentTotalRakeFees = await nodeWallet.totalRakeFees(
            nodeId
        )
        const {
            entryFee
        } = getValidTournamentParams()
        const participantCount = 2
        // Rake fee %
        const rakeFeePercent = 0.2
        const totalPrizePool = (entryFee * participantCount * (1 - rakeFeePercent))
        const totalRakeFees = entryFee * participantCount * rakeFeePercent
        console.log('tournament fees',
            web3.utils.fromWei(preCompleteTournamentRakeFees.toString(), 'ether'),
            web3.utils.fromWei(postCompleteTournamentRakeFees.toString(), 'ether'),
            web3.utils.fromWei(totalRakeFees.toString(), 'ether')
        )
        assert.equal(
            new BigNumber(postCompleteTournamentRakeFees).isEqualTo(
                new BigNumber(preCompleteTournamentRakeFees).plus(
                    totalRakeFees
                )
            ),
            true
        )
        assert.equal(
            new BigNumber(postCompleteTournamentTotalRakeFees).isEqualTo(
                new BigNumber(preCompleteTournamentTotalRakeFees).plus(
                    totalRakeFees
                )
            ),
            true
        )

        // Validate prize distribution
        const preClaimUser1TokenBalance = await token.balanceOf(user1)
        await tournament.claimTournamentPrize(
            standardTournamentId,
            0,
            0,
            {
                from: user1
            }
        )
        const postClaimUser1TokenBalance = await token.balanceOf(user1)

        const preClaimUser2TokenBalance = await token.balanceOf(user2)
        await tournament.claimTournamentPrize(
            standardTournamentId,
            1,
            0,
            {
                from: user2
            }
        )
        const postClaimUser2TokenBalance = await token.balanceOf(user2)

        console.log(
            'tournament prizes - user1',
            web3.utils.fromWei(postClaimUser1TokenBalance.toString(), 'ether'),
            web3.utils.fromWei(preClaimUser1TokenBalance.toString(), 'ether'),
        )
        console.log(
            'tournament prizes - user2',
            web3.utils.fromWei(postClaimUser2TokenBalance.toString(), 'ether'),
            web3.utils.fromWei(preClaimUser2TokenBalance.toString(), 'ether'),
        )

        assertStandardClaimCalculations(
            web3.utils.fromWei(postClaimUser1TokenBalance, 'ether'),
            web3.utils.fromWei(preClaimUser1TokenBalance, 'ether'),
            100,
            50,
            1,
            20,
            1
        )

        assertStandardClaimCalculations(
            web3.utils.fromWei(postClaimUser2TokenBalance, 'ether'),
            web3.utils.fromWei(preClaimUser2TokenBalance, 'ether'),
            100,
            30,
            1,
            20,
            1
        )
    })

    it('throws if non-tournament address tries to call add tournament rake fee in node wallet contract', async () => {
        await utils.assertFail(
            nodeWallet.addTournamentRakeFee(
                nodeId,
                standardTournamentId,
                100
            )
        )
    })

    it('throws if non-node holder tries to withdraw rake fees for node in node wallet', async () => {
        await utils.assertFail(
            nodeWallet.withdrawTournamentRakeFees(
                nodeId
            )
        )
    })

    it('allows node holders to withdraw rake fees if it has a positive total rake fees balance', async () => {
        const totalRakeFees = await nodeWallet.totalRakeFees(nodeId)
        const preWithdrawNodeHolderBalance = await token.balanceOf(nodeHolder)
        await nodeWallet.withdrawTournamentRakeFees(
                nodeId,
                {
                    from: nodeHolder
                }
            )
        const postWithdrawNodeHolderBalance = await token.balanceOf(nodeHolder)
        assert.equal(
            new BigNumber(postWithdrawNodeHolderBalance).isEqualTo(
                new BigNumber(preWithdrawNodeHolderBalance).plus(totalRakeFees)
            ),
            true
        )
    })

    it('throws if node holders withdraw rake fees when it\'s 0', async () => {
        await utils.assertFail(
            nodeWallet.withdrawTournamentRakeFees(
                nodeId,
                {
                    from: nodeHolder
                }
            )
        )
    })

})