const appRoot = require('app-root-path')

const constants = require(`${appRoot}/lib/constants`)

function MigrationScript(web3, contractManager, deployer, args) {
    let defaultAccount

    let admin,
        quest,
        token,
        tournament

    const TOKEN_NAME = 'Decent.bet Token'
    const TOKEN_SYMBOL = 'DBET'
    const TOKEN_DECIMALS = 18
    const TOTAL_DBET_SUPPLY = '205903294831970956466297922'

    const getAccounts = () => {
        return web3.eth.accounts.wallet
    }

    const getDefaultOptions = () => {
        return {
            from: defaultAccount,
            gas: 8000000
        }
    }

    // Migration script
    this.migrate = async (chain) => {
        const Admin = contractManager.getContract('Admin')
        const DecentBetToken = contractManager.getContract('DBETVETToken')
        const Quest = contractManager.getContract('Quest')
        const Tournament = contractManager.getContract('Tournament')

        let accounts = await getAccounts()
        defaultAccount = accounts[0].address
        console.log('Available accounts', accounts.length, defaultAccount)

        try {
            if(chain === constants.CHAIN_SOLO || chain === constants.CHAIN_TESTNET) {
                // Deploy the DecentBetToken contract
                token = await deployer.deploy(
                    DecentBetToken,
                    TOKEN_NAME,
                    TOKEN_SYMBOL,
                    TOKEN_DECIMALS,
                    TOTAL_DBET_SUPPLY,
                    getDefaultOptions()
                )
                console.log('Deployed token')

                // Deploy the Admin contract
                admin = await deployer.deploy(
                    Admin,
                    getDefaultOptions()
                )
                console.log('Deployed admin')

                // Deploy the Quest contract
                quest = await deployer.deploy(
                    Quest,
                    admin.options.address,
                    token.options.address,
                    getDefaultOptions()
                )
                console.log('Deployed quest')

                // Deploy the Tournament contract
                tournament = await deployer.deploy(
                    Tournament,
                    admin.options.address,
                    token.options.address,
                    getDefaultOptions()
                )
                console.log('Deployed tournament')

                console.log(
                    'Deployed:',
                    '\nAdmin: ' + admin.options.address,
                    '\nQuest: ' + quest.options.address,
                    '\nToken: ' + token.options.address,
                    '\nTournament: ' + tournament.options.address
                )
            } else if (chain === constants.CHAIN_MAIN) {
            }
        } catch (e) {
            console.log('Error deploying contracts:', e.message, e.stack)
        }
    }
}

module.exports = (web3, dbet, deployer, args) => {
    return new MigrationScript(web3, dbet, deployer, args)
}
