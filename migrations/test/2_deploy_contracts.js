const Admin = artifacts.require('Admin')
const DBETNode = artifacts.require('DBETNode')
const DecentBetToken = artifacts.require('DBETVETToken')
const MultiSigWallet = artifacts.require('MultiSigWallet')
const Quest = artifacts.require('Quest')
const Tournament = artifacts.require('Tournament')
const utils = require('../../test/utils/utils')

let deploy = async (deployer, network) => {
    web3.eth.defaultAccount = process.env.DEFAULT_ACCOUNT

    let admin,
        multiSigWallet,
        dbetNode,
        quest,
        token,
        tournament

    const TOKEN_NAME = 'Decent.bet Token'
    const TOKEN_SYMBOL = 'DBET'
    const TOKEN_DECIMALS = 18
    const TOTAL_DBET_SUPPLY = '205903294831970956466297922'
    const BOOTSTRAP_TOKEN_AMOUNT = utils.getWeb3().utils.toWei(
        '10000000',
        'ether'
    )

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
            const platformWallet = web3.eth.defaultAccount
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

            // Set the platform wallet in admin
            console.log('Setting platform wallet:', platformWallet)
            await admin.setPlatformWallet(platformWallet)
            await token.transfer(
                platformWallet,
                BOOTSTRAP_TOKEN_AMOUNT
            )

            if(process.env.ADMIN_ADDRESS) {
                const adminAddress = process.env.ADMIN_ADDRESS
                console.log(`Adding ${adminAddress} as admin`)
                await admin.addAdmin(adminAddress)
                await token.transfer(
                    adminAddress,
                    BOOTSTRAP_TOKEN_AMOUNT
                )
            }
            // Deploy the DBETNode contract
            console.log('Deploying DBET node')
            await deployer.deploy(
                DBETNode,
                admin.address,
                token.address
            )
            dbetNode = await getContractInstanceAndInfo(DBETNode)
            console.log('Successfully deployed DBET node')

            // Deploy the quest contract
            await deployer.deploy(
                Quest,
                admin.address,
                token.address,
                dbetNode.address
            )
            quest = await getContractInstanceAndInfo(Quest)
            console.log('Deployed quest')

            await token.approve(
                quest.address,
                BOOTSTRAP_TOKEN_AMOUNT
            )

            // Deploy the tournament contract
            await deployer.deploy(
                Tournament,
                admin.address,
                token.address,
                dbetNode.address
            )
            tournament = await getContractInstanceAndInfo(Tournament)
            console.log('Deployed tournament')

            console.log('Setting DBET node contracts', quest.address, tournament.address)
            // Set contract addresses in the DBET Node contract
            await dbetNode.setContracts(
                quest.address,
                tournament.address
            )

            console.log(
                'Deployed:',
                '\nAdmin: ' + admin.address,
                '\nDBETNode: ' + dbetNode.address,
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
