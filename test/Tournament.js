const BigNumber = require('bignumber.js')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let admin,
    token,
    tournament

let owner
let platformWallet
let user1
let user2

let web3 = utils.getWeb3()

let prizeTableId
let tournamentId1
let tournamentId2
let tournamentId3

const getValidPrizeTable = () => {
    return [
        50,
        30,
        20
    ]
}

const getValidTournamentParams = entryLimit => {
    const entryFee = web3.utils.toWei('50', 'ether')
    const minEntries = 1
    const maxEntries = 10
    const rakePercent = 20
    return {
        entryFee,
        entryLimit,
        minEntries,
        maxEntries,
        rakePercent
    }
}

const getValidTournamentCompletionParams = () => {
    const finalStandings1 = [[0]] // Indices of entries
    const uniqueFinalStandings1 = 1
    const finalStandings2 = [[0, 1], [0, 1], []] // Final standings for entries in the tournament
    const uniqueFinalStandings2 = 2
    const finalStandings3 = [[0], [1], []]
    const uniqueFinalStandings3 = 2
    return {
        finalStandings1,
        uniqueFinalStandings1,
        finalStandings2,
        uniqueFinalStandings2,
        finalStandings3,
        uniqueFinalStandings3
    }
}

const assertClaimCalculations = (
    postBalance,
    preBalance,
    totalEntryFee,
    finalStandingPercent,
    uniqueFinalStandings,
    excessPrizePercent,
    sharedFinalStandings
) => {
    if(excessPrizePercent) {
        excessPrizePercent =
            new BigNumber(excessPrizePercent)
                .multipliedBy(finalStandingPercent)
                .dividedBy(new BigNumber(100).minus(excessPrizePercent))
    } else
        excessPrizePercent = 0
    console.log({excessPrizePercent: excessPrizePercent.toString()})
    const calculatedPrize =
        new BigNumber(totalEntryFee)    // Total entry fee
            .multipliedBy(0.8)          // After rake fee
            .multipliedBy(
                new BigNumber(finalStandingPercent) // Final standing 0 Prize percent
                    .plus(
                        excessPrizePercent
                    )
            )
            .multipliedBy(0.01) // Divide by 100 for percent
            .dividedBy(sharedFinalStandings)  // Divide by number of shared final standings
    const calculatedPostBalance =
        new BigNumber(
            preBalance
        ).plus(
            calculatedPrize
        )
    console.log({
        postBalance: postBalance.toString(),
        calculatedPostBalance: calculatedPostBalance.toString(),
        calculatedPrize: calculatedPrize.toString()
    })
    assert.equal(
        new BigNumber(
            postBalance
        ).isEqualTo(
            calculatedPostBalance
        ),
        true
    )
}

contract('Tournament', accounts => {
    it('initializes tournament contract', async () => {
        owner = accounts[0]
        platformWallet = accounts[1]
        user1 = accounts[2]
        user2 = accounts[3]

        admin = await contracts.Admin.deployed()
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
            web3.utils.toWei('1000000000', 'ether'),
            {
                from: platformWallet
            }
        )

        // Transfer DBETs to platform wallet
        await token.transfer(
            platformWallet,
            web3.utils.toWei('1000000', 'ether')
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

    it('throws if non-admins create tournaments', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent
        } = getValidTournamentParams(1)

        await utils.assertFail(
            tournament.createTournament(
                entryFee,
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
                prizeTableId,
                {
                    from: user2
                }
            )
        )
    })

    it('throws if admin creates tournament with invalid values', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent
        } = getValidTournamentParams(1)

        // Invalid entry fee
        await utils.assertFail(
            tournament.createTournament(
                '0',
                entryLimit,
                minEntries,
                maxEntries,
                rakePercent,
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
                web3.utils.fromUtf8('invalid'),
                {
                    from: owner
                }
            )
        )
    })

    it('allows admins to create tournaments with valid params', async () => {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent
        } = getValidTournamentParams(1)

        const tx1 = await tournament.createTournament(
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeTableId,
            {
                from: owner
            }
        )

        tournamentId1 = tx1.logs[0].args.id
        let tournamentCountAtCreation = tx1.logs[0].args.count

        assert.equal(
            tournamentCountAtCreation,
            '0'
        )

        const tx2 = await tournament.createTournament(
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeTableId,
            {
                from: owner
            }
        )

        tournamentId2 = tx2.logs[0].args.id
        tournamentCountAtCreation = tx2.logs[0].args.count

        assert.equal(
            tournamentCountAtCreation,
            '1'
        )

        const tx3 = await tournament.createTournament(
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeTableId,
            {
                from: owner
            }
        )

        tournamentId3 = tx3.logs[0].args.id
        tournamentCountAtCreation = tx3.logs[0].args.count

        assert.equal(
            tournamentCountAtCreation,
            '2'
        )
    })

    it('throws if user enters invalid tournament', async () => {
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

    it('throws if user enters tournament with invalid balances and allowances', async () => {
        // Invalid balance
        await utils.assertFail(
            tournament.enterTournament(
                tournamentId1,
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
                tournamentId1,
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

    it('allows user to enter running tournament with valid balances and allowances', async () => {
        // User 1 enters tournament 1
        const preEnterTournament1User1Balance = await token.balanceOf(user1)
        const tx1 = await tournament.enterTournament(
            tournamentId1,
            {
                from: user1
            }
        )
        const postEnterTournament1User1Balance = await token.balanceOf(user1)

        console.log(
            'Enter T1U1',
            web3.utils.fromWei(preEnterTournament1User1Balance.toString(), 'ether'),
            web3.utils.fromWei(postEnterTournament1User1Balance.toString(), 'ether')
        )

        assert.equal(
            tx1.logs[0].args.id,
            tournamentId1
        )
        // User 1 enters tournament 2
        const preEnterTournament2User1Balance = await token.balanceOf(user1)
        const tx2 = await tournament.enterTournament(
            tournamentId2,
            {
                from: user1
            }
        )
        const postEnterTournament2User1Balance = await token.balanceOf(user1)

        console.log(
            'Enter T2U1',
            web3.utils.fromWei(preEnterTournament2User1Balance.toString(), 'ether'),
            web3.utils.fromWei(postEnterTournament2User1Balance.toString(), 'ether')
        )

        assert.equal(
            tx2.logs[0].args.id,
            tournamentId2
        )

        // User 2 enters tournament 2
        const preEnterTournament2User2_1Balance = await token.balanceOf(user2)
        const tx3 = await tournament.enterTournament(
            tournamentId2,
            {
                from: user2
            }
        )
        const postEnterTournament2User2_1Balance = await token.balanceOf(user2)

        console.log(
            'Enter T2U2_1',
            web3.utils.fromWei(preEnterTournament2User2_1Balance.toString(), 'ether'),
            web3.utils.fromWei(postEnterTournament2User2_1Balance.toString(), 'ether')
        )

        assert.equal(
            tx3.logs[0].args.id,
            tournamentId2
        )
        // User 2 enters tournament 2 again
        const preEnterTournament2User2_2Balance = await token.balanceOf(user2)
        const tx4 = await tournament.enterTournament(
            tournamentId2,
            {
                from: user2
            }
        )
        const postEnterTournament2User2_2Balance = await token.balanceOf(user2)

        console.log(
            'Enter T2U2_2',
            web3.utils.fromWei(preEnterTournament2User2_2Balance.toString(), 'ether'),
            web3.utils.fromWei(postEnterTournament2User2_2Balance.toString(), 'ether')
        )

        assert.equal(
            tx4.logs[0].args.id,
            tournamentId2
        )
        // User 1 enters tournament 3
        const preEnterTournament3User1_1Balance = await token.balanceOf(user1)
        const tx5 = await tournament.enterTournament(
            tournamentId3,
            {
                from: user1
            }
        )
        const postEnterTournament3User1_1Balance = await token.balanceOf(user1)

        console.log(
            'Enter T3U1_1',
            web3.utils.fromWei(preEnterTournament3User1_1Balance.toString(), 'ether'),
            web3.utils.fromWei(postEnterTournament3User1_1Balance.toString(), 'ether')
        )

        assert.equal(
            tx5.logs[0].args.id,
            tournamentId3
        )
        // User 2 enters tournament 3
        const preEnterTournament3User2Balance = await token.balanceOf(user2)
        const tx6 = await tournament.enterTournament(
            tournamentId3,
            {
                from: user2
            }
        )
        const postEnterTournament3User2Balance = await token.balanceOf(user2)

        console.log(
            'Enter T3U2',
            web3.utils.fromWei(preEnterTournament3User2Balance.toString(), 'ether'),
            web3.utils.fromWei(postEnterTournament3User2Balance.toString(), 'ether')
        )

        assert.equal(
            tx6.logs[0].args.id,
            tournamentId3
        )

        // User 1 enters tournament 3 again
        const preEnterTournament3User1_2Balance = await token.balanceOf(user1)
        const tx7 = await tournament.enterTournament(
            tournamentId3,
            {
                from: user1
            }
        )
        const postEnterTournament3User1_2Balance = await token.balanceOf(user1)

        console.log(
            'Enter T3U1_2',
            web3.utils.fromWei(preEnterTournament3User1_2Balance.toString(), 'ether'),
            web3.utils.fromWei(postEnterTournament3User1_2Balance.toString(), 'ether')
        )

        assert.equal(
            tx7.logs[0].args.id,
            tournamentId3
        )
    })

    it('throws if non-admin completes tournament', async () => {
        const {
            finalStandings1,
            uniqueFinalStandings1
        } = getValidTournamentCompletionParams()

        await utils.assertFail(
            tournament.completeTournament(
                tournamentId1,
                finalStandings1,
                uniqueFinalStandings1,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if admin completes tournament with an invalid ID', async () => {
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

    it('allows admin to complete tournament with valid final standings', async () => {
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
            tournamentId1,
            finalStandings1,
            uniqueFinalStandings1,
            {
                from: owner
            }
        )

        assert.equal(
            tx1.logs[0].args.id,
            tournamentId1
        )

        // Complete tournament 2
        const tx2 = await tournament.completeTournament(
            tournamentId2,
            finalStandings2,
            uniqueFinalStandings2,
            {
                from: owner
            }
        )

        assert.equal(
            tx2.logs[0].args.id,
            tournamentId2
        )

        // Complete tournament 3
        const tx3 = await tournament.completeTournament(
            tournamentId3,
            finalStandings3,
            uniqueFinalStandings3,
            {
                from: owner
            }
        )

        assert.equal(
            tx3.logs[0].args.id,
            tournamentId3
        )
    })

    it('throws if user enters completed tournament', async () => {
        // Enter completed tournament
        await utils.assertFail(
            tournament.enterTournament(
                tournamentId1,
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
                tournamentId1,
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
                tournamentId1,
                0,
                1,
                {
                    from: user1
                }
            )
        )
    })

    it('allows user to claim tournament prize with valid id and index', async () => {
        // Claim tournament 1 prize as user 1
        const preClaimTournament1User1Balance =
            web3.utils.fromWei(await token.balanceOf(user1), 'ether')

        const tx1 = await tournament.claimTournamentPrize(
            tournamentId1,
            0,
            0,
            {
                from: user1
            }
        )

        const postClaimTournament1User1Balance =
            web3.utils.fromWei(await token.balanceOf(user1), 'ether')

        console.log(
            'T1U1',
            preClaimTournament1User1Balance,
            postClaimTournament1User1Balance,
            tx1.logs[0].args.finalStanding.toString(),
            tx1.logs[0].args.prizeFromTable.toString(),
            tx1.logs[0].args.prizeMoney.toString()
        )

        assertClaimCalculations(
            postClaimTournament1User1Balance,
            preClaimTournament1User1Balance,
            50,
            50,
            1,
            50,
            1
        )

        assert.equal(
            tx1.logs[0].args.id,
            tournamentId1
        )

        // Claim tournament 2 prize as user1
        const preClaimTournament2User1Balance =
            web3.utils.fromWei(await token.balanceOf(user1), 'ether')

        const tx2e0fs0 = await tournament.claimTournamentPrize(
            tournamentId2,
            0,
            0,
            {
                from: user1
            }
        )
        const postClaimTournament2User1Entry0Fs0Balance =
            web3.utils.fromWei(await token.balanceOf(user1), 'ether')

        const tx2e0fs1 = await tournament.claimTournamentPrize(
            tournamentId2,
            0,
            1,
            {
                from: user1
            }
        )

        const postClaimTournament2User1Entry0Fs1Balance =
            web3.utils.fromWei(await token.balanceOf(user1), 'ether')

        console.log(
            'T2U1-E0',
            preClaimTournament2User1Balance,
            postClaimTournament2User1Entry0Fs0Balance,
            postClaimTournament2User1Entry0Fs1Balance,
            tx2e0fs0.logs[0].args.finalStanding.toString(),
            tx2e0fs0.logs[0].args.prizeFromTable.toString(),
            tx2e0fs0.logs[0].args.prizeMoney.toString(),
            tx2e0fs1.logs[0].args.finalStanding.toString(),
            tx2e0fs1.logs[0].args.prizeFromTable.toString(),
            tx2e0fs1.logs[0].args.prizeMoney.toString()
        )

        // Ensure claim calculations for T2U1E0FS0 is correct
        assertClaimCalculations(
            postClaimTournament2User1Entry0Fs0Balance,
            preClaimTournament2User1Balance,
            150,
            50,
            2,
            20,
            2
        )

        // Ensure claim calculations for T2U1E1FS1 is correct
        assertClaimCalculations(
            postClaimTournament2User1Entry0Fs1Balance,
            postClaimTournament2User1Entry0Fs0Balance,
            150,
            30,
            2,
            20,
            2
        )

        assert.equal(
            tx2e0fs0.logs[0].args.id,
            tournamentId2
        )

        assert.equal(
            tx2e0fs1.logs[0].args.id,
            tournamentId2
        )

        // Claim tournament 2 prizes as user2
        const preClaimTournament2User2Entry1Balance =
            web3.utils.fromWei(await token.balanceOf(user2), 'ether')

        const tx2e1fs0 = await tournament.claimTournamentPrize(
            tournamentId2,
            1,
            0,
            {
                from: user2
            }
        )

        const postClaimTournament2User2Entry1Fs0Balance =
            web3.utils.fromWei(await token.balanceOf(user2), 'ether')

        const tx2e1fs1 = await tournament.claimTournamentPrize(
            tournamentId2,
            1,
            1,
            {
                from: user2
            }
        )

        const postClaimTournament2User2Entry1Fs1Balance =
            web3.utils.fromWei(await token.balanceOf(user2), 'ether')

        console.log(
            'T2U2-E1',
            postClaimTournament2User2Entry1Fs1Balance,
            postClaimTournament2User2Entry1Fs0Balance,
            postClaimTournament2User2Entry1Fs1Balance,
            tx2e1fs0.logs[0].args.finalStanding.toString(),
            tx2e1fs0.logs[0].args.prizeFromTable.toString(),
            tx2e1fs0.logs[0].args.prizeMoney.toString(),
            tx2e1fs1.logs[0].args.finalStanding.toString(),
            tx2e1fs1.logs[0].args.prizeFromTable.toString(),
            tx2e1fs1.logs[0].args.prizeMoney.toString()
        )

        // Ensure claim calculations for T2U2E1FS0 is correct
        assertClaimCalculations(
            postClaimTournament2User2Entry1Fs0Balance,
            preClaimTournament2User2Entry1Balance,
            150,
            50,
            2,
            20,
            2
        )

        // Ensure claim calculations for T2U2E1FS1 is correct
        assertClaimCalculations(
            postClaimTournament2User2Entry1Fs1Balance,
            postClaimTournament2User2Entry1Fs0Balance,
            150,
            30,
            2,
            20,
            2
        )

        assert.equal(
            tx2e1fs0.logs[0].args.id,
            tournamentId2
        )

        assert.equal(
            tx2e1fs1.logs[0].args.id,
            tournamentId2
        )
        // const preClaimTournament2User2Entry2Balance = await token.balanceOf(user2)
        //
        // const tx4 = await tournament.claimTournamentPrize(
        //     tournamentId2,
        //     2,
        //     0,
        //     {
        //         from: user2
        //     }
        // )
        //
        // const postClaimTournament2User2Entry2Balance = await token.balanceOf(user2)
        //
        // console.log(
        //     'T2U2-E2',
        //     web3.utils.fromWei(preClaimTournament2User2Entry2Balance, 'ether'),
        //     web3.utils.fromWei(postClaimTournament2User2Entry2Balance, 'ether'),
        //     tx4.logs[0].args.finalStanding.toString(),
        //     tx4.logs[0].args.prizeFromTable.toString(),
        //     tx4.logs[0].args.prizeMoney.toString()
        // )
        //
        // assert.equal(
        //     new BigNumber(postClaimTournament2User2Entry2Balance).isGreaterThan(preClaimTournament2User2Entry2Balance),
        //     true
        // )
        //
        // assert.equal(
        //     tx4.logs[0].args.id,
        //     tournamentId2
        // )

        // Claim tournament 3 prizes as user 1
        const preClaimTournament3User1Entry0Balance =
            web3.utils.fromWei(await token.balanceOf(user1), 'ether')

        const tx5 = await tournament.claimTournamentPrize(
            tournamentId3,
            0,
            0,
            {
                from: user1
            }
        )

        const postClaimTournament3User1Entry0Balance =
            web3.utils.fromWei(await token.balanceOf(user1), 'ether')

        console.log(
            'T3U1-E0',
            preClaimTournament3User1Entry0Balance, 'ether',
            postClaimTournament3User1Entry0Balance, 'ether',
            tx5.logs[0].args.finalStanding.toString(),
            tx5.logs[0].args.prizeFromTable.toString(),
            tx5.logs[0].args.prizeMoney.toString()
        )

        // Ensure claim calculations for T3U1E0 is correct
        assertClaimCalculations(
            postClaimTournament3User1Entry0Balance,
            preClaimTournament3User1Entry0Balance,
            150,
            50,
            2,
            20,
            1
        )

        assert.equal(
            tx5.logs[0].args.id,
            tournamentId3
        )

        // Claim tournament 3 prize as user 2
        const preClaimTournament3User2Entry1Balance =
            web3.utils.fromWei(await token.balanceOf(user2), 'ether')

        const tx6 = await tournament.claimTournamentPrize(
            tournamentId3,
            1,
            0,
            {
                from: user2
            }
        )

        const postClaimTournament3User2Entry1Balance =
            web3.utils.fromWei(await token.balanceOf(user2), 'ether')

        console.log(
            'T3U2-E1',
            preClaimTournament3User2Entry1Balance,
            postClaimTournament3User2Entry1Balance,
            tx6.logs[0].args.finalStanding.toString(),
            tx6.logs[0].args.prizeFromTable.toString(),
            tx6.logs[0].args.prizeMoney.toString()
        )


        // Ensure claim calculations for T3U2E1 is correct
        assertClaimCalculations(
            postClaimTournament3User2Entry1Balance,
            preClaimTournament3User2Entry1Balance,
            150,
            30,
            2,
            20,
            1
        )

        assert.equal(
            tx6.logs[0].args.id,
            tournamentId3
        )
    })

    it('throws if user claims a previously claimed entry', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                tournamentId1,
                0,
                0,
                {
                    from: user1
                }
            )
        )
    })

})
