const BigNumber = require('bignumber.js')
const timeTraveler = require('ganache-time-traveler')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')
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

const {
    getHouseNode
} = require('./utils/nodes')

let admin,
    dbetNode,
    token,
    tournament

let owner
let platformWallet
let user1
let user2
let nodeHolder

let web3 = utils.getWeb3()

const timeTravel = async timeDiff => {
    await timeTraveler.advanceTime(timeDiff)
}

let prizeTableId
let standardTournamentId1
let standardTournamentId2
let standardTournamentId3

let winnerTakeAllTournamentId
let fiftyFiftyTournamentId

let nodeTournamentId

contract('Tournament', accounts => {
    it('initializes tournament contract', async () => {
        owner = accounts[0]
        platformWallet = accounts[1]
        user1 = accounts[2]
        user2 = accounts[3]
        nodeHolder = accounts[4]

        admin = await contracts.Admin.deployed()
        dbetNode = await contracts.DBETNode.deployed()
        token = await contracts.DBETVETToken.deployed()
        tournament = await contracts.Tournament.deployed()

        await admin.setPlatformWallet(
            platformWallet,
            {
                from: owner
            }
        )

        const _platformWallet = await admin.platformWallet()
        assert.equal(
            platformWallet,
            _platformWallet
        )

        // Approve platform wallet to transfer DBETs for prizes
        await token.approve(
            tournament.address,
            web3.utils.toWei('1000000000', 'ether'), // 1b DBETs
            {
                from: platformWallet
            }
        )

        // Transfer DBETs to platform wallet
        await token.transfer(
            platformWallet,
            web3.utils.toWei('1000000', 'ether') // 1m DBETs
        )
    })

    it('throws if non-admin creates prize table', async () => {
        await utils.assertFail(
            tournament.createPrizeTable(
                getValidPrizeTable(),
                {
                    from: user1
                }
            )
        )
    })

    it('throws if admin creates invalid prize table', async () => {
        await utils.assertFail(
            tournament.createPrizeTable(
                [],
                {
                    from: owner
                }
            )
        )
    })

    it('allows admins to create valid prize tables', async () => {
        const tx = await tournament.createPrizeTable(
            getValidPrizeTable(),
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
    })

    it('throws if non-admins create standard tournaments', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(1)

        await utils.assertFail(
            tournament.createTournament(
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: user2
                }
            )
        )
    })

    it('throws if admin creates standard tournaments with invalid values', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(1)

        // Invalid entry fee
        await utils.assertFail(
            tournament.createTournament(
                '0',
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: owner
                }
            )
        )

        // Invalid min entries
        await utils.assertFail(
            tournament.createTournament(
                entryFee,
                entryLimit,
                '0',
                maxEntries,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: owner
                }
            )
        )

        // Invalid max entries
        await utils.assertFail(
            tournament.createTournament(
                entryFee,
                entryLimit,
                minEntries,
                '0',
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: owner
                }
            )
        )

        // Invalid rake percent
        await utils.assertFail(
            tournament.createTournament(
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                '0',
                prizeType,
                prizeTableId,
                {
                    from: owner
                }
            )
        )

        // Invalid prize type
        await utils.assertFail(
            tournament.createTournament(
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                100,
                prizeTableId,
                {
                    from: owner
                }
            )
        )

        // Invalid prize table ID
        await utils.assertFail(
            tournament.createTournament(
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType,
                web3.utils.fromUtf8('invalid'),
                {
                    from: owner
                }
            )
        )
    })

    it('allows admins to create standard tournaments with valid params', async () => {
        const createTournament = async (
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

            const tx = await tournament.createTournament(
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: owner
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
        standardTournamentId1 = await createTournament(
            1,
            0
        )
        standardTournamentId2 = await createTournament(
            1,
            1
        )
        standardTournamentId3 = await createTournament(
            1,
            2
        )
    })

    it('throws if user enters invalid tournaments', async () => {
        await utils.assertFail(
            tournament.enterTournament(
                web3.utils.fromUtf8(
                    'invalid'
                ),
                {
                    from: user2
                }
            )
        )
    })

    it('throws if user enters tournaments with invalid balances and allowances', async () => {
        // Invalid balance
        await utils.assertFail(
            tournament.enterTournament(
                standardTournamentId1,
                {
                    from: user2
                }
            )
        )

        const tokenAmount = web3.utils.toWei('100000', 'ether')
        // Transfer tokens to user1
        await token.transfer(
            user1,
            tokenAmount,
            {
                from: owner
            }
        )

        // Approve tokens for transfer
        await token.approve(
            tournament.address,
            tokenAmount,
            {
                from: user1
            }
        )

        // Transfer tokens to user2
        await token.transfer(
            user2,
            tokenAmount,
            {
                from: owner
            }
        )

        // Invalid allowance
        await utils.assertFail(
            tournament.enterTournament(
                standardTournamentId1,
                {
                    from: user2
                }
            )
        )

        // Approve tokens for transfer
        await token.approve(
            tournament.address,
            tokenAmount,
            {
                from: user2
            }
        )
    })

    it('allows user to enter running tournaments with valid balances and allowances', async () => {
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
        // User 1 enters tournament 1
        await enterTournament(
            user1,
            standardTournamentId1
        )
        // User 1 enters tournament 2
        await enterTournament(
            user1,
            standardTournamentId2
        )
        // User 2 enters tournament 2
        await enterTournament(
            user2,
            standardTournamentId2
        )
        // User 2 enters tournament 2 again
        await enterTournament(
            user2,
            standardTournamentId2
        )
        // User 1 enters tournament 3
        await enterTournament(
            user1,
            standardTournamentId3
        )
        // User 2 enters tournament 3
        await enterTournament(
            user2,
            standardTournamentId3
        )
        // User 1 enters tournament 3 again
        await enterTournament(
            user1,
            standardTournamentId3
        )
    })

    it('throws if non-admin completes tournaments', async () => {
        const {
            finalStandings1,
            uniqueFinalStandings1
        } = getValidTournamentCompletionParams()

        await utils.assertFail(
            tournament.completeTournament(
                standardTournamentId1,
                finalStandings1,
                uniqueFinalStandings1,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if admin completes tournaments with invalid IDs', async () => {
        const {
            finalStandings1,
            uniqueFinalStandings1
        } = getValidTournamentCompletionParams()

        await utils.assertFail(
            tournament.completeTournament(
                web3.utils.fromUtf8('invalid'),
                finalStandings1,
                uniqueFinalStandings1,
                {
                    from: owner
                }
            )
        )
    })

    it('allows admin to complete tournaments with valid final standings', async () => {
        const {
            finalStandings1,
            uniqueFinalStandings1,
            finalStandings2,
            uniqueFinalStandings2,
            finalStandings3,
            uniqueFinalStandings3
        } = getValidTournamentCompletionParams()

        // Complete tournament 1
        const tx1 = await tournament.completeTournament(
            standardTournamentId1,
            finalStandings1,
            uniqueFinalStandings1,
            {
                from: owner
            }
        )

        assert.equal(
            tx1.logs[0].args.id,
            standardTournamentId1
        )

        // Complete tournament 2
        const tx2 = await tournament.completeTournament(
            standardTournamentId2,
            finalStandings2,
            uniqueFinalStandings2,
            {
                from: owner
            }
        )

        assert.equal(
            tx2.logs[0].args.id,
            standardTournamentId2
        )

        // Complete tournament 3
        const tx3 = await tournament.completeTournament(
            standardTournamentId3,
            finalStandings3,
            uniqueFinalStandings3,
            {
                from: owner
            }
        )

        assert.equal(
            tx3.logs[0].args.id,
            standardTournamentId3
        )
    })

    it('throws if user enters completed tournament', async () => {
        // Enter completed tournament
        await utils.assertFail(
            tournament.enterTournament(
                standardTournamentId1,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if user claims tournament prize with invalid id', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                web3.utils.fromUtf8('invalid'),
                0,
                0,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if user claims tournament prize with an invalid entry index', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                standardTournamentId1,
                1,
                0,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if user claims tournament prize with an invalid finalStanding index', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                standardTournamentId1,
                0,
                1,
                {
                    from: user1
                }
            )
        )
    })

    it('allows users or admins to claim standard tournament prizes with valid IDs and indices', async () => {
        const claimAndAssertTournamentPrize = async (
            tournamentId,
            user,
            entryIndex,
            finalStandingIndex,
            totalEntryFee,
            finalStandingPercent,
            uniqueFinalStandings,
            excessPrizePercent,
            sharedFinalStandings,
            sender
        ) => {
            if (!sender)
                sender = user
            const preClaimTournamentUserBalance =
                web3.utils.fromWei(await token.balanceOf(user), 'ether')

            const tx = await tournament.claimTournamentPrize(
                tournamentId,
                entryIndex,
                finalStandingIndex,
                {
                    from: sender
                }
            )

            const postClaimTournamentUserBalance =
                web3.utils.fromWei(await token.balanceOf(user), 'ether')

            console.log(
                'Tournament', tournamentId,
                'User', user,
                preClaimTournamentUserBalance,
                postClaimTournamentUserBalance,
                tx.logs[0].args.finalStanding.toString(),
                tx.logs[0].args.prizeFromTable.toString(),
                tx.logs[0].args.prizeMoney.toString()
            )

            assertStandardClaimCalculations(
                postClaimTournamentUserBalance,
                preClaimTournamentUserBalance,
                totalEntryFee,
                finalStandingPercent,
                uniqueFinalStandings,
                excessPrizePercent,
                sharedFinalStandings
            )

            assert.equal(
                tx.logs[0].args.id,
                tournamentId
            )
        }

        // Claim tournament 1 prize as user 1
        await claimAndAssertTournamentPrize(
            standardTournamentId1,
            user1,
            0,  // entry index
            0,  // final standing index
            50, // total entry fee
            50, // final standing percent
            1,  // unique final standings
            50, // excess prize percent
            1   // shared final standings
        )

        // Claim tournament 2 prize for user1
        await claimAndAssertTournamentPrize(
            standardTournamentId2,
            user1,
            0,
            0,
            150,
            50,
            2,
            20,
            2
        )

        // Claim tournament 2 prize for user1 as admin
        await claimAndAssertTournamentPrize(
            standardTournamentId2,
            user1,
            0,
            1,
            150,
            30,
            2,
            20,
            2,
            owner
        )

        // Claim tournament 2 prize as user2
        await claimAndAssertTournamentPrize(
            standardTournamentId2,
            user2,
            1,
            0,
            150,
            50,
            2,
            20,
            2
        )
        // Claim tournament 2 prize as admin
        await claimAndAssertTournamentPrize(
            standardTournamentId2,
            user2,
            1,
            1,
            150,
            30,
            2,
            20,
            2,
            owner
        )

        // Claim tournament 3 prizes as user 1
        await claimAndAssertTournamentPrize(
            standardTournamentId3,
            user1,
            0,
            0,
            150,
            50,
            2,
            20,
            1
        )

        // Claim tournament 3 prize as user 2
        await claimAndAssertTournamentPrize(
            standardTournamentId3,
            user2,
            1,
            0,
            150,
            30,
            2,
            20,
            1
        )
    })

    it('throws if user claims a previously claimed entry', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                standardTournamentId1,
                0,
                0,
                {
                    from: user1
                }
            )
        )
    })

    it('allows admins to create winner take all tournaments with valid params', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(
            1,
            PRIZE_TYPE_WINNER_TAKE_ALL
        )

        const tx = await tournament.createTournament(
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType,
            prizeTableId,
            {
                from: owner
            }
        )

        winnerTakeAllTournamentId = tx.logs[0].args.id
        let tournamentCountAtCreation = tx.logs[0].args.count

        assert.equal(
            tournamentCountAtCreation,
            '3'
        )
    })

    it('allows users or admins to claim winner take all tournament prizes with valid IDs and indices', async () => {
        const enterTournament = async (
            user
        ) => {
            const tx = await tournament.enterTournament(
                winnerTakeAllTournamentId,
                {
                    from: user
                }
            )
            assert.equal(
                tx.logs[0].args.id,
                winnerTakeAllTournamentId
            )
        }
        // User 1 enters tournament
        await enterTournament(user1)

        // User 2 enters tournament
        await enterTournament(user2)

        // User 1 enters tournament again
        await enterTournament(user1)

        // User 2 enters tournament again
        await enterTournament(user2)
        console.log('All users entered to winner take all tournament')

        const {
            finalStandings4,
            uniqueFinalStandings4
        } = getValidTournamentCompletionParams()

        // Complete tournament
        await tournament.completeTournament(
            winnerTakeAllTournamentId,
            finalStandings4,
            uniqueFinalStandings4,
            {
                from: owner
            }
        )
        console.log('Completed winner take all tournament')

        const claimAndAssertTournamentPrize = async (
            user,
            entryIndex,
            finalStandingIndex,
            sharedFinalStandings,
            sender
        ) => {
            if (!sender)
                sender = user

            const preClaimTournamentUserBalance =
                web3.utils.fromWei(await token.balanceOf(user), 'ether')

            const tx = await tournament.claimTournamentPrize(
                winnerTakeAllTournamentId,
                entryIndex,
                finalStandingIndex,
                {
                    from: sender
                }
            )

            const postClaimTournamentBalance =
                web3.utils.fromWei(await token.balanceOf(user), 'ether')

            console.log(
                preClaimTournamentUserBalance,
                postClaimTournamentBalance,
                tx.logs[0].args.finalStanding.toString(),
                tx.logs[0].args.prizeFromTable.toString(),
                tx.logs[0].args.prizeMoney.toString()
            )

            assertWinnerTakeAllClaimCalculations(
                postClaimTournamentBalance,
                preClaimTournamentUserBalance,
                200,
                sharedFinalStandings
            )

            assert.equal(
                tx.logs[0].args.id,
                winnerTakeAllTournamentId
            )
        }

        // Claim tournament prize as user 1
        await claimAndAssertTournamentPrize(
            user1,
            0,
            0,
            2
        )

        // Claim tournament prize as owner
        await claimAndAssertTournamentPrize(
            user2,
            1,
            0,
            2,
            owner
        )
    })

    it('throws if non-winner claims winner take all tournament prize', async () => {
        // User 1 claims entry 2
        await utils.assertFail(
            tournament.claimTournamentPrize(
                winnerTakeAllTournamentId,
                2,
                2,
                {
                    from: user1
                }
            )
        )

        // User 2 claims entry 3
        await utils.assertFail(
            tournament.claimTournamentPrize(
                winnerTakeAllTournamentId,
                3,
                3,
                {
                    from: user2
                }
            )
        )
    })

    it('allows admins to create 50-50 tournaments with valid params', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(
            1,
            PRIZE_TYPE_FIFTY_FIFTY
        )

        const tx = await tournament.createTournament(
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType,
            prizeTableId,
            {
                from: owner
            }
        )

        fiftyFiftyTournamentId = tx.logs[0].args.id
        let tournamentCountAtCreation = tx.logs[0].args.count

        assert.equal(
            tournamentCountAtCreation,
            '4'
        )
    })

    it('allows user to claim 50-50 tournament prizes with valid IDs and indices', async () => {
        const enterFiftyFiftyTournament = async user => {
            const tx = await tournament.enterTournament(
                fiftyFiftyTournamentId,
                {
                    from: user
                }
            )
            assert.equal(
                tx.logs[0].args.id,
                fiftyFiftyTournamentId
            )
        }
        // Create 10 alternating entries from user1 and user2
        for(let i = 0; i < 5; i++) {
            await enterFiftyFiftyTournament(user1)
            await enterFiftyFiftyTournament(user2)
        }
        console.log('All users entered to 50-50 tournament')

        const {
            finalStandings5,
            uniqueFinalStandings5
        } = getValidTournamentCompletionParams()

        // Complete tournament
        await tournament.completeTournament(
            fiftyFiftyTournamentId,
            finalStandings5,
            uniqueFinalStandings5,
            {
                from: owner
            }
        )
        console.log('Completed 50-50 tournament')

        const claimAndAssertTournamentPrize = async (
            user,
            entryIndex,
            finalStandingIndex,
            sender
        ) => {
            if (!sender)
                sender = user
            // Claim tournament prize as user
            const preClaimTournamentBalance =
                web3.utils.fromWei(await token.balanceOf(user), 'ether')

            const tx = await tournament.claimTournamentPrize(
                fiftyFiftyTournamentId,
                entryIndex,
                finalStandingIndex,
                {
                    from: sender
                }
            )

            const postClaimTournamentBalance =
                web3.utils.fromWei(await token.balanceOf(user), 'ether')

            console.log(
                'Entry index: ', entryIndex,
                'Final standing index: ', finalStandingIndex,
                preClaimTournamentBalance,
                postClaimTournamentBalance,
                tx.logs[0].args.finalStanding.toString(),
                tx.logs[0].args.prizeFromTable.toString(),
                tx.logs[0].args.prizeMoney.toString()
            )

            assertFiftyFiftyClaimCalculations(
                postClaimTournamentBalance,
                preClaimTournamentBalance,
                50 * 10,
                1,
                10
            )
        }

        const assertFailedClaimTournamentPrize = async (
            user,
            entryIndex,
            finalStandingIndex
        ) => {
            await utils.assertFail(
                tournament.claimTournamentPrize(
                    fiftyFiftyTournamentId,
                    entryIndex,
                    finalStandingIndex,
                    {
                        from: user
                    }
                )
            )
        }

        // [[2], [5], [6], [7], [9], [0], [1], [3], [4], [8]]
        // Entry index 0, Final standing index 0
        await claimAndAssertTournamentPrize(
            user1,
            0,
            0
        )

        // Entry index 1, Final standing index 0
        // Claim as owner (admin)
        await assertFailedClaimTournamentPrize(
            user2,
            1,
            0,
            owner
        )

        // Entry index 2, Final standing index 0
        await assertFailedClaimTournamentPrize(
            user1,
            2,
            0
        )

        // Entry index 3, Final standing index 0
        // Claim as owner (admin)
        await assertFailedClaimTournamentPrize(
            user2,
            3,
            0,
            owner
        )

        // Entry index 4, Final standing index 0
        await assertFailedClaimTournamentPrize(
            user1,
            4,
            0
        )

        // Entry index 5, Final standing index 0
        await claimAndAssertTournamentPrize(
            user2,
            5,
            0
        )

        // Entry index 6, Final standing index 0
        await claimAndAssertTournamentPrize(
            user1,
            6,
            0
        )

        // Entry index 7, Final standing index 0
        await claimAndAssertTournamentPrize(
            user2,
            7,
            0
        )

        // Entry index 8, Final standing index 0
        await claimAndAssertTournamentPrize(
            user1,
            8,
            0
        )

        // Entry index 9, Final standing index 0
        await assertFailedClaimTournamentPrize(
            user2,
            9,
            0
        )
    })

    it('throws if non-node holders create node tournaments', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(1)

        await utils.assertFail(
            tournament.createNodeTournament(
                0,
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: owner
                }
            )
        )
    })

    it('throws if node holders create node tournaments before activation', async () => {
        // Transfer DBETs to node holder
        await token.transfer(
            nodeHolder,
            web3.utils.toWei('2000000', 'ether')
        )

        // Add a new node type as admin
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

        // Approve tokens to be transferred on behalf of user from DBETNode and Quest contracts
        await token.approve(
            dbetNode.address,
            utils.MAX_VALUE,
            {
                from: nodeHolder
            }
        )
        await token.approve(
            tournament.address,
            utils.MAX_VALUE,
            {
                from: nodeHolder
            }
        )
        // Create node of type ID 1
        await dbetNode.create(
            1,
            {
                from: nodeHolder
            }
        )
        // Try adding create a node tournament before node activation
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(1)

        const nodeId = 0
        await utils.assertFail(
            tournament.createNodeTournament(
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
        )
    })

    it('throws if active node holders create node tournaments with invalid parameters', async () => {
        const {
            timeThreshold,
        } = getHouseNode()
        // Move forward in time by `timeThreshold` to activate node
        await timeTravel(timeThreshold)

        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(1)

        const nodeId = 1
        // Invalid node ID
        await utils.assertFail(
            tournament.createNodeTournament(
                2,
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
        )

        // Invalid entry fee
        await utils.assertFail(
            tournament.createNodeTournament(
                nodeId,
                0,
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
        )

        // Invalid entry limit
        await utils.assertFail(
            tournament.createNodeTournament(
                nodeId,
                entryFee,
                0,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: nodeHolder
                }
            )
        )

        // Invalid min entries
        await utils.assertFail(
            tournament.createNodeTournament(
                nodeId,
                entryFee,
                entryLimit,
                0,
                maxEntries,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: nodeHolder
                }
            )
        )

        // Invalid max entries
        await utils.assertFail(
            tournament.createNodeTournament(
                nodeId,
                entryFee,
                entryLimit,
                minEntries,
                0,
                rakePercent,
                prizeType,
                prizeTableId,
                {
                    from: nodeHolder
                }
            )
        )

        // Invalid rake percent
        await utils.assertFail(
            tournament.createNodeTournament(
                nodeId,
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                0,
                prizeType,
                prizeTableId,
                {
                    from: nodeHolder
                }
            )
        )

        // Invalid prize type
        await utils.assertFail(
            tournament.createNodeTournament(
                nodeId,
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                3,
                prizeTableId,
                {
                    from: nodeHolder
                }
            )
        )

        // Invalid prize table ID
        await utils.assertFail(
            tournament.createNodeTournament(
                nodeId,
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeType,
                web3.utils.fromUtf8('abc'),
                {
                    from: nodeHolder
                }
            )
        )
    })

    it('allows active node holders to create node tournaments', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(1)

        const nodeId = 1
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

        nodeTournamentId = tx.logs[0].args.id
        let tournamentCountAtCreation = tx.logs[0].args.count

        assert.equal(
            tournamentCountAtCreation,
            '5'
        )
    })

    it('pays discounted fee if active node holder enters tournament', async () => {
        const {
            entryFee
        } = getValidTournamentParams(1)
        const {
            entryFeeDiscount
        } = getHouseNode()

        const nodeId = 1
        const preEnterTournamentUserBalance =
            await token.balanceOf(nodeHolder)
        await tournament.enterTournamentWithNode(
            nodeTournamentId,
            nodeId,
            {
                from: nodeHolder
            }
        )
        const postEnterTournamentUserBalance =
            await token.balanceOf(nodeHolder)

        assert.equal(
            new BigNumber(
                web3.utils.fromWei(postEnterTournamentUserBalance.toString(), 'ether')
            ).isEqualTo(
                new BigNumber(web3.utils.fromWei(preEnterTournamentUserBalance.toString(), 'ether'))
                    .minus(
                        new BigNumber(web3.utils.fromWei(entryFee, 'ether'))
                            .multipliedBy(100 - entryFeeDiscount)
                            .dividedBy(100)
                    )
            ),
            true
        )
    })

    it('allows users or admins to claim node tournament prizes with valid IDs and indices', async () => {
        const {
            finalStandings1,
            uniqueFinalStandings1
        } = getValidTournamentCompletionParams()

        // Complete tournament 1
        const tx = await tournament.completeTournament(
            nodeTournamentId,
            finalStandings1,
            uniqueFinalStandings1,
            {
                from: owner
            }
        )

        assert.equal(
            tx.logs[0].args.id,
            nodeTournamentId
        )

        const claimAndAssertTournamentPrize = async (
            tournamentId,
            user,
            entryIndex,
            finalStandingIndex,
            totalEntryFee,
            finalStandingPercent,
            uniqueFinalStandings,
            excessPrizePercent,
            sharedFinalStandings,
            sender
        ) => {
            if (!sender)
                sender = user
            const preClaimTournamentUserBalance =
                web3.utils.fromWei(await token.balanceOf(user), 'ether')

            const tx = await tournament.claimTournamentPrize(
                tournamentId,
                entryIndex,
                finalStandingIndex,
                {
                    from: sender
                }
            )

            const postClaimTournamentUserBalance =
                web3.utils.fromWei(await token.balanceOf(user), 'ether')

            console.log(
                'Tournament', tournamentId,
                'User', user,
                preClaimTournamentUserBalance,
                postClaimTournamentUserBalance,
                tx.logs[0].args.finalStanding.toString(),
                tx.logs[0].args.prizeFromTable.toString(),
                tx.logs[0].args.prizeMoney.toString()
            )

            assertStandardClaimCalculations(
                postClaimTournamentUserBalance,
                preClaimTournamentUserBalance,
                totalEntryFee,
                finalStandingPercent,
                uniqueFinalStandings,
                excessPrizePercent,
                sharedFinalStandings
            )

            assert.equal(
                tx.logs[0].args.id,
                tournamentId
            )
        }

        // Claim node tournament prize as user 1
        await claimAndAssertTournamentPrize(
            nodeTournamentId,
            nodeHolder,
            0,  // entry index
            0,  // final standing index
            45, // total entry fee
            50, // final standing percent
            1,  // unique final standings
            50, // excess prize percent
            1   // shared final standings
        )
    })

    it('refunds discounted entry fee for cancelled node holder tournament entries', async () => {
        // Create another node tournament
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType
        } = getValidTournamentParams(1)

        const nodeId = 1
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

        nodeTournamentId = tx.logs[0].args.id
        let tournamentCountAtCreation = tx.logs[0].args.count

        assert.equal(
            tournamentCountAtCreation,
            '6'
        )

        await tournament.enterTournamentWithNode(
            nodeTournamentId,
            nodeId,
            {
                from: nodeHolder
            }
        )

        const {
            entryFeeDiscount
        } = getHouseNode()

        // Complete tournament with `FAILED` status
        await tournament.completeTournament(
            nodeTournamentId,
            [],
            0,
            {
                from: owner
            }
        )

        // Claim tournament refund
        const preClaimRefundUserBalance =
            await token.balanceOf(nodeHolder)
        await tournament.claimTournamentRefund(
            nodeTournamentId,
            0,
            {
                from: nodeHolder
            }
        )
        const postClaimRefundUserBalance =
            await token.balanceOf(nodeHolder)

        assert.equal(
            new BigNumber(
                web3.utils.fromWei(postClaimRefundUserBalance.toString(), 'ether')
            ).isEqualTo(
                new BigNumber(web3.utils.fromWei(preClaimRefundUserBalance.toString(), 'ether'))
                    .plus(
                        new BigNumber(web3.utils.fromWei(entryFee, 'ether'))
                            .multipliedBy(100 - entryFeeDiscount)
                            .dividedBy(100)
                    )
            ),
            true
        )
    })

})