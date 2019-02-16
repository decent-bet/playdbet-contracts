const contracts = require('./utils/contracts')
const utils = require('./utils/utils')

let admin

let owner
let user1
let user2

contract('Admin', accounts => {
    it('initializes admin contract', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        admin = await contracts.Admin.deployed()
    })

    it('throws if non-owners add an admin', async () => {
        await utils.assertFail(
            admin.addAdmin(user2, {from: user1})
        )
    })

    it('allows owners to add admins', async () => {
        await admin.addAdmin(user2, {from: owner})
        const isUser2Admin = await admin.admins(user2)
        assert.equal(
            isUser2Admin,
            true
        )
    })

    it('throws if non-owners remove admins', async () => {
        await utils.assertFail(
            admin.removeAdmin(user2, {from: user1})
        )
    })

    it('allows owners to remove admins', async () => {
        await admin.removeAdmin(user2, {from: owner})

        const isUser2Admin = await admin.admins(user2)

        assert.equal(
            isUser2Admin,
            false
        )
    })

    it('throws if non-owner sets platform wallet', async () => {
        await utils.assertFail(
            admin.setPlatformWallet(
                user2,
                {
                    from: user1
                }
            )
        )
    })

    it('allows owner to set platform wallet', async () => {
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
    })
})
