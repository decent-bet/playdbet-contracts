const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let token,
    tournament

let owner
let user1
let user2

let web3 = utils.getWeb3()

let prizeTableId

const getValidPrizeTable = () => {
    return [
        web3.utils.toWei('500', 'ether'),
        web3.utils.toWei('250', 'ether'),
        web3.utils.toWei('100', 'ether')
    ]
}

contract('Tournament', accounts => {
    it('initializes tournament contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        token = await contracts.DBETVETToken.deployed()
        tournament = await contracts.Tournament.deployed()
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

    })

    it('throws if admin creates tournament with invalid values', async () => {

    })

    it('allows admins to create valid tournaments', async () => {

    })

    it('throws if user enters invalid tournament', async () => {

    })

    it('throws if user enters tournament with invalid balances and allowances', async () => {

    })

    it('allows user to enter running tournament with valid balances and allowances', async () => {

    })

    it('throws if user enters completed tournament', async () => {

    })

    it('throws if non-admin completes tournament', async () => {

    })

    it('throws if admin completes tournament with an invalid ID', async () => {

    })

    it('throws if admin completes tournament with invalid final standings', async () => {

    })

    it('allows admin to complete tournament with valid final standings', async () => {

    })

    it('throws if users claims tournament prize with invalid id', async () => {

    })

    it('throws if user claims tournament prize with invalid index', async () => {

    })

    it('allows user to claim tournament prize with valid id and index', async () => {

    })

})
