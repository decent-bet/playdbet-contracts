const BigNumber = require('bignumber.js')

const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let admin,
    token,
    tournament

let owner
let user1
let user2

let web3 = utils.getWeb3()

let prizeTableId
let tournamentId

const getValidPrizeTable = () => {
    return [
        60,
        30,
        10
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
    const finalStandings = [0] // Indices of entries
    return {
        finalStandings
    }
}

contract('Tournament', accounts => {
    it('initializes tournament contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        admin = await contracts.Admin.deployed()
        token = await contracts.DBETVETToken.deployed()
        tournament = await contracts.Tournament.deployed()

        await admin.setPlatformWallet(
            user1,
            {
                from: owner
            }
        )

        const platformWallet = await admin.platformWallet()
        assert.equal(
            platformWallet,
            user1
        )

        // Approve platform wallet to transfer DBETs for prizes
        await token.approve(
            tournament.address,
            web3.utils.toWei('1000000000', 'ether'),
            {
                from: user1
            }
        )

        // Transfer DBETs to platform wallet
        await token.transfer(
            user1,
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

        const tx = await tournament.createTournament(
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

        tournamentId = tx.logs[0].args.id
        let tournamentCount = tx.logs[0].args.count

        assert.equal(
            tournamentCount,
            '0'
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
                tournamentId,
                {
                    from: user2
                }
            )
        )

        const tokenAmount = web3.utils.toWei('100000', 'ether')
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
                tournamentId,
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
        const tx = await tournament.enterTournament(
            tournamentId,
            {
                from: user2
            }
        )
        assert.equal(
            tx.logs[0].args.id,
            tournamentId
        )
    })

    it('throws if non-admin completes tournament', async () => {
        const {
            finalStandings
        } = getValidTournamentCompletionParams()

        await utils.assertFail(
            tournament.completeTournament(
                tournamentId,
                finalStandings,
                {
                    from: user2
                }
            )
        )
    })

    it('throws if admin completes tournament with an invalid ID', async () => {
        const {
            finalStandings
        } = getValidTournamentCompletionParams()

        await utils.assertFail(
            tournament.completeTournament(
                web3.utils.fromUtf8('invalid'),
                finalStandings,
                {
                    from: owner
                }
            )
        )
    })

    it('allows admin to complete tournament with valid final standings', async () => {
        const {
            finalStandings
        } = getValidTournamentCompletionParams()

        const tx = await tournament.completeTournament(
            tournamentId,
            finalStandings,
            {
                from: owner
            }
        )

        assert.equal(
            tx.logs[0].args.id,
            tournamentId
        )
    })

    it('throws if user enters completed tournament', async () => {
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

        // Enter completed tournament
        await utils.assertFail(
            tournament.enterTournament(
                tournamentId,
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
                    from: user2
                }
            )
        )
    })

    it('throws if user claims tournament prize with invalid index', async () => {
        await utils.assertFail(
            tournament.claimTournamentPrize(
                tournamentId,
                1,
                {
                    from: user2
                }
            )
        )
    })

    it('allows user to claim tournament prize with valid id and index', async () => {
        const preClaimBalance = await token.balanceOf(user2)

        const tx = await tournament.claimTournamentPrize(
            tournamentId,
            0,
            {
                from: user2
            }
        )

        const postClaimBalance = await token.balanceOf(user2)

        assert.equal(
            new BigNumber(postClaimBalance).isGreaterThan(preClaimBalance),
            true
        )

        assert.equal(
            tx.logs[0].args.id,
            tournamentId
        )
    })

})
