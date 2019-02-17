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

const getValidPrizeTable = () => {
    return [
        60,
        40
    ]
}

const getValidTournamentParams = isMultiEntry => {
    const entryFee = web3.utils.toWei('50', 'ether')
    const minEntries = 1
    const maxEntries = 10
    const rakePercent = 20
    return {
        entryFee,
        isMultiEntry: isMultiEntry ? isMultiEntry : false,
        minEntries,
        maxEntries,
        rakePercent
    }
}

const getValidTournamentCompletionParams = () => {
    const finalStandings1 = [0] // Indices of entries
    const finalStandings2 = [0, 1] // Indices of entries
    return {
        finalStandings1,
        finalStandings2
    }
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
            isMultiEntry,
            minEntries,
            maxEntries,
            rakePercent
        } = getValidTournamentParams()

        await utils.assertFail(
            tournament.createTournament(
                entryFee,
                isMultiEntry,
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
            isMultiEntry,
            minEntries,
            maxEntries,
            rakePercent
        } = getValidTournamentParams()

        // Invalid entry fee
        await utils.assertFail(
            tournament.createTournament(
                '0',
                isMultiEntry,
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
                isMultiEntry,
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
                isMultiEntry,
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
                isMultiEntry,
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
                isMultiEntry,
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
            isMultiEntry,
            minEntries,
            maxEntries,
            rakePercent
        } = getValidTournamentParams()

        const tx1 = await tournament.createTournament(
            entryFee,
            isMultiEntry,
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
            isMultiEntry,
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
        const tx1 = await tournament.enterTournament(
            tournamentId1,
            {
                from: user1
            }
        )
        assert.equal(
            tx1.logs[0].args.id,
            tournamentId1
        )
        // User 1 enters tournament 2
        const tx2 = await tournament.enterTournament(
            tournamentId2,
            {
                from: user1
            }
        )
        assert.equal(
            tx2.logs[0].args.id,
            tournamentId2
        )
        // User 2 enters tournament 2
        const tx3 = await tournament.enterTournament(
            tournamentId2,
            {
                from: user2
            }
        )
        assert.equal(
            tx3.logs[0].args.id,
            tournamentId2
        )
    })

    it('throws if non-admin completes tournament', async () => {
        const {
            finalStandings1
        } = getValidTournamentCompletionParams()

        await utils.assertFail(
            tournament.completeTournament(
                tournamentId1,
                finalStandings1,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if admin completes tournament with an invalid ID', async () => {
        const {
            finalStandings1
        } = getValidTournamentCompletionParams()

        await utils.assertFail(
            tournament.completeTournament(
                web3.utils.fromUtf8('invalid'),
                finalStandings1,
                {
                    from: owner
                }
            )
        )
    })

    it('allows admin to complete tournament with valid final standings', async () => {
        const {
            finalStandings1,
            finalStandings2
        } = getValidTournamentCompletionParams()

        // Complete tournament 1
        const tx1 = await tournament.completeTournament(
            tournamentId1,
            finalStandings1,
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
            {
                from: owner
            }
        )

        assert.equal(
            tx2.logs[0].args.id,
            tournamentId2
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

    it('throws if users claims tournament prize with invalid id', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                web3.utils.fromUtf8('invalid'),
                0,
                {
                    from: user1
                }
            )
        )
    })

    it('throws if user claims tournament prize with invalid index', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                tournamentId1,
                1,
                {
                    from: user1
                }
            )
        )
    })

    it('allows user to claim tournament prize with valid id and index', async () => {
        // Claim tournament 1 prize as user 1
        const preClaimTournament1User1Balance = await token.balanceOf(user1)

        const tx1 = await tournament.claimTournamentPrize(
            tournamentId1,
            0,
            {
                from: user1
            }
        )

        const postClaimTournament1User1Balance = await token.balanceOf(user1)

        console.log(
            'T1U1',
            web3.utils.fromWei(preClaimTournament1User1Balance, 'ether'),
            web3.utils.fromWei(postClaimTournament1User1Balance, 'ether')
        )

        assert.equal(
            new BigNumber(postClaimTournament1User1Balance).isGreaterThan(preClaimTournament1User1Balance),
            true
        )

        assert.equal(
            tx1.logs[0].args.id,
            tournamentId1
        )

        // Claim tournament 2 prize as user1
        const preClaimTournament2User1Balance = await token.balanceOf(user1)

        const tx2 = await tournament.claimTournamentPrize(
            tournamentId2,
            0,
            {
                from: user1
            }
        )

        const postClaimTournament2User1Balance = await token.balanceOf(user1)

        console.log(
            'T2U1',
            web3.utils.fromWei(preClaimTournament2User1Balance, 'ether'),
            web3.utils.fromWei(postClaimTournament2User1Balance, 'ether')
        )

        assert.equal(
            new BigNumber(postClaimTournament2User1Balance).isGreaterThan(preClaimTournament2User1Balance),
            true
        )

        assert.equal(
            tx2.logs[0].args.id,
            tournamentId2
        )

        // Claim tournament 2 prize as user2
        const preClaimTournament2User2Balance = await token.balanceOf(user2)

        const tx3 = await tournament.claimTournamentPrize(
            tournamentId2,
            1,
            {
                from: user2
            }
        )

        const postClaimTournament2User2Balance = await token.balanceOf(user2)

        console.log(
            'T2U2',
            web3.utils.fromWei(preClaimTournament2User2Balance, 'ether'),
            web3.utils.fromWei(postClaimTournament2User2Balance, 'ether')
        )

        assert.equal(
            new BigNumber(postClaimTournament2User2Balance).isGreaterThan(preClaimTournament2User2Balance),
            true
        )

        assert.equal(
            tx3.logs[0].args.id,
            tournamentId2
        )
    })

    it('throws if user claims a previously claimed entry', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                tournamentId1,
                0,
                {
                    from: user1
                }
            )
        )
    })

})
