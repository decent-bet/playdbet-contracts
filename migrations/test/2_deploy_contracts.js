const DecentBetToken = artifacts.require('DBETVETToken')
const Quest = artifacts.require('Quest')
const utils = require('../../test/utils/utils')

let deploy = async (deployer, network) => {
    web3.eth.defaultAccount = process.env.DEFAULT_ACCOUNT

    let token,
        quest

    const TOKEN_NAME = 'Decent.bet Token'
    const TOKEN_SYMBOL = 'DBET'
    const TOKEN_DECIMALS = 18
    const TOTAL_DBET_SUPPLY = '205903294831970956466297922'

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

            // Deploy the quest contract
            await deployer.deploy(
                Quest,
                token.address
            )
            quest = await getContractInstanceAndInfo(Quest)

            console.log(
                'Deployed:',
                '\nToken: ' + token.address,
                '\nQuest: ' + quest.address,
                '\n\nContract info:\n',
                contractInfo
            )
        } catch (e) {
            console.log('Error deploying contracts', e.message, e.stack)
        }
    } else if (network === 'mainnet') {
        try {

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
