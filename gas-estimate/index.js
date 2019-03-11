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

const {
    AdminMethods,
    QuestMethods,
    TournamentMethods
} = require('./methods')

console.log('Node URL', config.getNodeUrl())
thorify(web3, config.getNodeUrl())

const privateKey = config.getParam('privateKey')
let chainTag

// Adds a private key to the web3 object wallet
const addPrivateKeyToWallet = () => web3.eth.accounts.wallet.add(privateKey)

// Returns the default account added to the web3 object wallet
const getDefaultAccount = () => web3.eth.accounts.wallet[0].address

// Returns accounts from default VET seed phrase
const getAccounts = () => [
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
    '0x733b7269443c70de16bbf9b0615307884bcc5636',
    '0x115eabb4f62973d0dba138ab7df5c0375ec87256',
    '0x199b836d8a57365baccd4f371c1fabb7be77d389'
]

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

// Default tx options
const getDefaultOptions = () => {
    return {
        from: getDefaultAccount()
    }
}

// Estimate gas for a txn call
const estimateGas = async (
    contract,
    method,
    args,
    gasUsage
) => gasUsage[method] = await contract.methods[method].apply(this, args).estimateGas(getDefaultOptions())

const {
    METHOD_ADD_ADMIN,
    METHOD_REMOVE_ADMIN,
    METHOD_SET_PLATFORM_WALLET,
    METHOD_SET_OWNER
} = AdminMethods

const getMethods = () => {
    const user1 = getAccounts()[1]
    return {
        admin: {
            [METHOD_ADD_ADMIN]: [user1],
            [METHOD_REMOVE_ADMIN]: [getDefaultAccount()],
            [METHOD_SET_PLATFORM_WALLET]: [user1],
            [METHOD_SET_OWNER]: [user1],
        }
    }
}

const estimateAdminTxns = async () => {
    let gasUsage = {}
    const {
        admin
    } = getContracts()
    const methods = getMethods().admin
    await Promise.all(Object.keys(methods).map(method =>
        estimateGas(admin, method, methods[method], gasUsage)
    ))
    console.log(
        'Gas estimates for Admin txns:',
        gasUsage
    )
}

const estimateQuestTxns = async () => {

}

const estimateTournamentTxns = async () => {

}

;(async () => {
    chainTag = await web3.eth.getChainTag()
    console.log('Chain tag:', chainTag)
    addPrivateKeyToWallet()
    await estimateAdminTxns()
    await estimateQuestTxns()
    await estimateTournamentTxns()
})()