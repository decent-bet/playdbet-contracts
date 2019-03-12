const appRoot = require('app-root-path')
const Config = require(`${appRoot}/lib/config`)
const config = new Config()

const { thorify } = require('thorify')

const Web3 = require('web3')
const web3 = thorify(new Web3(), config.getNodeUrl())

const Admin = require(`${appRoot}/build/contracts/Admin`)
const Quest = require(`${appRoot}/build/contracts/Quest`)
const Token = require(`${appRoot}/build/contracts/DBETVETToken`)
const Tournament = require(`${appRoot}/build/contracts/Tournament`)

const {
    AdminMethods,
    QuestMethods,
    TournamentMethods
} = require('./methods')

// Admin methods
const {
    METHOD_ADD_ADMIN,
    METHOD_REMOVE_ADMIN,
    METHOD_SET_PLATFORM_WALLET,
    METHOD_SET_OWNER
} = AdminMethods

// Quest methods
const {
    METHOD_ADD_QUEST,
    METHOD_PAY_FOR_QUEST,
    METHOD_SET_QUEST_OUTCOME,
    METHOD_CANCEL_QUEST,
    METHOD_CLAIM_REFUND
} = QuestMethods

// Tournament methods
const {
    METHOD_CREATE_PRIZE_TABLE,
    METHOD_CREATE_TOURNAMENT,
    METHOD_ENTER_TOURNAMENT,
    METHOD_COMPLETE_TOURNAMENT,
    METHOD_CLAIM_TOURNAMENT_PRIZE,
    METHOD_CLAIM_TOURNAMENT_REFUND
} = TournamentMethods

const CONTRACT_ADMIN = 'admin'
const CONTRACT_QUEST = 'quest'
const CONTRACT_TOKEN = 'token'
const CONTRACT_TOURNAMENT = 'tournament'

const EMPTY_BYTES_32 = '0x'

const PRIZE_TYPE_STANDARD = 0
const PRIZE_TYPE_WINNER_TAKE_ALL = 1
const PRIZE_TYPE_FIFTY_FIFTY = 2

const prizeTables = [
    {
        table: [50, 30, 20],
        id: null
    },
    {
        table: [60, 20, 15, 5],
        id: null
    }
]

const tournaments = [
    {
        entryFee: web3.utils.toWei('50', 'ether'),
        entryLimit: 1, // How many times a single address can enter
        minEntries: 3,
        maxEntries: 12,
        rakePercent: 10,
        prizeType: PRIZE_TYPE_STANDARD,
        prizeTable: null,
        id: null
    },
    {
        entryFee: web3.utils.toWei('100', 'ether'),
        entryLimit: 2,
        minEntries: 4,
        maxEntries: 24,
        rakePercent: 20,
        prizeType: PRIZE_TYPE_STANDARD,
        prizeTable: null,
        id: null
    },
    {
        entryFee: web3.utils.toWei('100', 'ether'),
        entryLimit: 1,
        minEntries: 2,
        maxEntries: 10,
        rakePercent: 20,
        prizeType: PRIZE_TYPE_WINNER_TAKE_ALL,
        prizeTable: EMPTY_BYTES_32,
        id: null
    },
    {
        entryFee: web3.utils.toWei('100', 'ether'),
        entryLimit: 1,
        minEntries: 2,
        maxEntries: 10,
        rakePercent: 20,
        prizeType: PRIZE_TYPE_FIFTY_FIFTY,
        prizeTable: EMPTY_BYTES_32,
        id: null
    },
]

const quests = [
    {
        id: web3.utils.toHex('quest_1'),
        entryFee: web3.utils.toWei('50', 'ether'), // 50 DBETs
        timeToComplete: 15 * 60, // 15 minutes
        prize: web3.utils.toWei('100', 'ether') // 100 DBETs
    },
    {
        id: web3.utils.toHex('quest_2'),
        entryFee: web3.utils.toWei('25', 'ether'), // 25 DBETs
        timeToComplete: 30 * 60, // 15 minutes
        prize: web3.utils.toWei('50', 'ether') // 50 DBETs
    },
    {
        id: web3.utils.toHex('quest_3'),
        entryFee: web3.utils.toWei('100', 'ether'), // 100 DBETs
        timeToComplete: 60 * 60, // 60 minutes
        prize: web3.utils.toWei('200', 'ether') // 200 DBETs
    },
    {
        id: web3.utils.toHex('quest_999'),
        entryFee: web3.utils.toWei('50', 'ether'), // 50 DBETs
        timeToComplete: 15 * 60, // 15 minutes
        prize: web3.utils.toWei('100', 'ether') // 100 DBETs
    }
]

let chainTag
const privateKey = config.getParam('privateKey')

// Adds a private key to the web3 object wallet
const addPrivateKeysToWallet = () => getAccounts().map(account => web3.eth.accounts.wallet.add(accounts[account]))

// Returns the default account added to the web3 object wallet
const getDefaultAccount = () => web3.eth.accounts.wallet[0].address

// Returns default accounts linked to default VET seed phrase
const accounts = {
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed': '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65',
    '0xd3ae78222beadb038203be21ed5ce7c9b1bff602': '0x321d6443bc6177273b5abf54210fe806d451d6b7973bccc2384ef78bbcd0bf51',
    '0x733b7269443c70de16bbf9b0615307884bcc5636': '0x2d7c882bad2a01105e36dda3646693bc1aaaa45b0ed63fb0ce23c060294f3af2',
}

// Returns accounts from default VET seed phrase
const getAccounts = () => Object.keys(accounts)

// Platform wallet address
const platformWallet = getAccounts()[2]

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
const getTxOptions = from => {
    return {
        from: from ? from : getDefaultAccount(),
        gas: 3000000
    }
}

const estimateGas = (
    name,
    method,
    params,
    options
) => getContracts()[name].methods[method].apply(this, params).estimateGas(options)

const estimateAdminTxns = async () => {
    const user1 = getAccounts()[1]
    const gasUsage = {}
    gasUsage.addAdmin = await estimateGas(CONTRACT_ADMIN, METHOD_ADD_ADMIN, [user1], getTxOptions())
    gasUsage.removeAdmin = await estimateGas(CONTRACT_ADMIN, METHOD_REMOVE_ADMIN, [user1], getTxOptions())
    gasUsage.setPlatformWallet = await estimateGas(CONTRACT_ADMIN, METHOD_SET_PLATFORM_WALLET, [platformWallet], getTxOptions())
    gasUsage.setOwner = await estimateGas(CONTRACT_ADMIN, METHOD_SET_OWNER, [user1], getTxOptions())
    console.log('Estimate admin txns:', gasUsage)
}

const estimateQuestTxns = async () => {
    const user1 = getAccounts()[1]
    const gasUsage = {}
    gasUsage.addForQuest = await estimateGas(
        CONTRACT_QUEST,
        METHOD_ADD_QUEST,
        [
            quests[3].id,
            quests[3].entryFee,
            quests[3].timeToComplete,
            quests[3].prize
        ],
        getTxOptions()
    )

    // Set platform wallet
    await getContracts()[CONTRACT_ADMIN]
        .methods
        .setPlatformWallet(
            platformWallet
        )
        .send(getTxOptions())
    // Transfer 1m tokens to platform wallet
    await getContracts()[CONTRACT_TOKEN]
        .methods
        .transfer(
            platformWallet,
            web3.utils.toWei('1000000', 'ether')
        )
        .send(getTxOptions())
    // Approve quest contract to transfer 1m tokens as platform wallet
    await getContracts()[CONTRACT_TOKEN]
        .methods
        .approve(
            getContracts()[CONTRACT_QUEST].options.address,
            web3.utils.toWei('100000', 'ether')
        )
        .send(getTxOptions(platformWallet))
    // Approve quest contract to transfer 100k tokens as owner
    await getContracts()[CONTRACT_TOKEN]
        .methods
        .approve(
            getContracts()[CONTRACT_QUEST].options.address,
            web3.utils.toWei('100000', 'ether')
        )
        .send(getTxOptions())
    gasUsage.payForQuest = await estimateGas(
        CONTRACT_QUEST,
        METHOD_PAY_FOR_QUEST,
        [
            quests[0].id,
            getDefaultAccount()
        ],
        getTxOptions()
    )
    await getContracts()[CONTRACT_QUEST]
        .methods
        .payForQuest(
            quests[0].id,
            getDefaultAccount()
        )
        .send(getTxOptions())
    gasUsage.setQuestOutcome = await estimateGas(
        CONTRACT_QUEST,
        METHOD_SET_QUEST_OUTCOME,
        [
            quests[0].id,
            getDefaultAccount(),
            2 // QuestEntryStatus.SUCCESS
        ],
        getTxOptions()
    )
    await getContracts()[CONTRACT_QUEST]
        .methods
        .payForQuest(
            quests[1].id,
            getDefaultAccount()
        )
        .send(getTxOptions())
    gasUsage.cancelQuest = await estimateGas(
        CONTRACT_QUEST,
        METHOD_CANCEL_QUEST,
        [
            quests[1].id
        ],
        getTxOptions()
    )
    await getContracts()[CONTRACT_QUEST]
        .methods
        .cancelQuest(
            quests[1].id
        )
        .send(getTxOptions())
    gasUsage.claimRefund = await estimateGas(
        CONTRACT_QUEST,
        METHOD_CLAIM_REFUND,
        [
            quests[1].id
        ],
        getTxOptions()
    )
    console.log('Estimate quest txns:', gasUsage)
}

const estimateTournamentTxns = async () => {

}

;(async () => {
    chainTag = await web3.eth.getChainTag()
    addPrivateKeysToWallet()
    console.log('Chain tag:', chainTag)
    await estimateAdminTxns()
    await estimateQuestTxns()
    // await estimateTournamentTxns()
})()