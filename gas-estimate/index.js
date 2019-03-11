const { thorify } = require('thorify')

const Web3 = require('web3')
const web3 = new Web3()

const appRoot = require('app-root-path')
const Config = require(`${appRoot}/lib/config`)
const config = new Config()

const Admin = require(`${appRoot}/build/contracts/Admin`)
const Quest = require(`${appRoot}/build/contracts/Quest`)
const Token = require(`${appRoot}/build/contracts/DBETVETToken`)
const Tournament = require(`${appRoot}/build/contracts/Tournament`)

console.log('Node URL', config.getNodeUrl())
thorify(web3, config.getNodeUrl())

const privateKey = config.getParam('privateKey')
let chainTag

// Adds a private key to the web3 object wallet
const addPrivateKeyToWallet = () => web3.eth.accounts.wallet.add(privateKey)

// Returns the default account added to the web3 object wallet
const getDefaultAccount = () => web3.eth.accounts.wallet[0].address

// Returns a web3 contract instance
const getContractInstance = contract => new web3.eth.Contract(
    contract.abi,
    contract.chain_tags[chainTag].address
)

// Returns all PlayDBET contract instances
const getContracts = () => {
    const admin = getContractInstance(Admin)
    const quest = getContractInstance(Quest)
    const token = getContractInstance(Token)
    const tournament = getContractInstance(Tournament)

    return {
        admin,
        quest,
        token,
        tournament
    }
}

const estimateAdminTxns = async () => {

}

const estimateQuestTxns = async () => {

}

const estimateTournamentTxns = async () => {

}

;(async () => {
    chainTag = await web3.eth.getChainTag()
    addPrivateKeyToWallet()
    await estimateAdminTxns()
    await estimateQuestTxns()
    await estimateTournamentTxns()
})()