const Admin = artifacts.require('Admin')
const DecentBetToken = artifacts.require('DBETVETToken')
const MultiSigWallet = artifacts.require('MultiSigWallet')
const Quest = artifacts.require('Quest')
const Tournament = artifacts.require('Tournament')
const utils = require('../../test/utils/utils')

let deploy = async (deployer, network) => {
    web3.eth.defaultAccount = process.env.DEFAULT_ACCOUNT

    let admin,
        multiSigWallet,
        quest,
        token,
        tournament

    const TOKEN_NAME = 'Decent.bet Token'
    const TOKEN_SYMBOL = 'DBET'
    const TOKEN_DECIMALS = 18
    const TOTAL_DBET_SUPPLY = '205903294831970956466297922'

    const MAINNET_TOKEN_ADDRESS = '' // V3 DBET token address
    const MULTISIG_OWNERS = []       // Must have 3 addresses
    const MULTISIG_CONFIRMATIONS = 2 // 2-of-3 multisig

    let contractInfo = {}

    const getContractInstanceAndInfo = async contract => {
        let instance = await contract.deployed()
        contractInfo[contract.contractName] = await utils.getGasUsage(
            contract,
            deployer.network_id
        )
        return instance
    }

    console.log('Deploying with network', network)

    if (network === 'rinkeby' || network === 'development') {
        try {
            // Deploy the DecentBetToken contract
            await deployer.deploy(
                DecentBetToken,
                TOKEN_NAME,
                TOKEN_SYMBOL,
                TOKEN_DECIMALS,
                TOTAL_DBET_SUPPLY
            )
            token = await getContractInstanceAndInfo(DecentBetToken)
            console.log('Deployed token')

            // Deploy the admin contract
            await deployer.deploy(
                Admin
            )
            admin = await getContractInstanceAndInfo(Admin)
            console.log('Deployed admin')

            // Deploy the quest contract
            await deployer.deploy(
                Quest,
                admin.address,
                token.address
            )
            quest = await getContractInstanceAndInfo(Quest)
            console.log('Deployed quest')

            // Deploy the tournament contract
            await deployer.deploy(
                Tournament,
                admin.address,
                token.address
            )
            tournament = await getContractInstanceAndInfo(Tournament)
            console.log('Deployed tournament')

            console.log(
                'Deployed:',
                '\nAdmin: ' + admin.address,
                '\nQuest: ' + quest.address,
                '\nToken: ' + token.address,
                '\nTournament: ' + tournament.address,
                '\n\nContract info:\n',
                contractInfo
            )
        } catch (e) {
            console.log('Error deploying contracts', e.message, e.stack)
        }
    } else if (network === 'mainnet') {
        try {
            // Deploy the multisig contract
            await deployer.deploy(
                MultiSigWallet,
                MULTISIG_OWNERS,
                MULTISIG_CONFIRMATIONS
            )
            multiSigWallet = await getContractInstanceAndInfo(MultiSigWallet)

            // Deploy the admin contract
            await deployer.deploy(
                Admin
            )
            admin = await getContractInstanceAndInfo(Admin)

            // Deploy the quest contract
            await deployer.deploy(
                Quest,
                admin.address,
                MAINNET_TOKEN_ADDRESS
            )
            quest = await getContractInstanceAndInfo(Quest)

            // Deploy the tournament contract
            await deployer.deploy(
                Tournament,
                admin.address,
                MAINNET_TOKEN_ADDRESS
            )
            tournament = await getContractInstanceAndInfo(Tournament)

            console.log(
                'Deployed:',
                '\nMultisig:' + multiSigWallet.address,
                '\nAdmin: ' + admin.address,
                '\nQuest: ' + quest.address,
                '\nToken: ' + MAINNET_TOKEN_ADDRESS,
                '\nTournament: ' + tournament.address,
                '\n\nContract info:\n',
                contractInfo
            )
        } catch (e) {
            console.log('Error deploying contracts', e.message)
        }
    }
}

module.exports = function(deployer, network) {
    // Work-around to stage tasks in the migration script and not actually run them
    // https://github.com/trufflesuite/truffle/issues/501#issuecomment-332589663
    deployer.then(() => deploy(deployer, network))
}
