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
    METHOD_CANCEL_QUEST_ENTRY,
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
    },
    {
        table: [40,25,20,15]
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
        prize: web3.utils.toWei('100', 'ether') // 100 DBETs
    },
    {
        id: web3.utils.toHex('quest_2'),
        entryFee: web3.utils.toWei('25', 'ether'), // 25 DBETs
        prize: web3.utils.toWei('50', 'ether') // 50 DBETs
    },
    {
        id: web3.utils.toHex('quest_3'),
        entryFee: web3.utils.toWei('100', 'ether'), // 100 DBETs
        prize: web3.utils.toWei('200', 'ether') // 200 DBETs
    },
    {
        id: web3.utils.toHex('quest_999'),
        entryFee: web3.utils.toWei('50', 'ether'), // 50 DBETs
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
) => {
    return getContracts()[name].methods[method].apply(this, params).estimateGas(options)
}

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
    const gasUsage = {}
    gasUsage.addForQuest = await estimateGas(
        CONTRACT_QUEST,
        METHOD_ADD_QUEST,
        [
            quests[3].id,
            quests[3].entryFee,
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
    // Transfer 1m tokens to user1
    await getContracts()[CONTRACT_TOKEN]
        .methods
        .transfer(
            getAccounts()[1],
            web3.utils.toWei('1000000', 'ether')
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
    gasUsage.cancelQuestEntry = await estimateGas(
        CONTRACT_QUEST,
        METHOD_CANCEL_QUEST_ENTRY,
        [
            quests[1].id,
            getDefaultAccount()
        ],
        getTxOptions()
    )
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
            quests[1].id,
            getDefaultAccount()
        ],
        getTxOptions()
    )
    console.log('Estimate quest txns:', gasUsage)
}

const estimateTournamentTxns = async () => {
    const user1 = getAccounts()[1]
    const user2 = getAccounts()[2]
    const gasUsage = {}
    gasUsage.createPrizeTable = await estimateGas(
        CONTRACT_TOURNAMENT,
        METHOD_CREATE_PRIZE_TABLE,
        [
            prizeTables[2].table
        ],
        getTxOptions()
    )
    const prizeTableTx = await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .createPrizeTable(
            prizeTables[2].table
        )
        .send(getTxOptions())
    prizeTables[2].id = prizeTableTx.outputs[0].events[0].topics[1]
    tournaments[0].prizeTable = prizeTables[2].id
    gasUsage.createTournament = await estimateGas(
        CONTRACT_TOURNAMENT,
        METHOD_CREATE_TOURNAMENT,
        [
            tournaments[0].entryFee,
            tournaments[0].entryLimit,
            tournaments[0].minEntries,
            tournaments[0].maxEntries,
            tournaments[0].rakePercent,
            tournaments[0].prizeType,
            tournaments[0].prizeTable
        ],
        getTxOptions()
    )
    const createTournamentTx = await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .createTournament(
            tournaments[0].entryFee,
            tournaments[0].entryLimit,
            tournaments[0].minEntries,
            tournaments[0].maxEntries,
            tournaments[0].rakePercent,
            tournaments[0].prizeType,
            tournaments[0].prizeTable
        )
        .send(getTxOptions())
    tournaments[0].id = createTournamentTx.outputs[0].events[0].topics[1]
    // Approve tournament contract to transfer 100k tokens as owner, user1 and user2
    await getContracts()[CONTRACT_TOKEN]
        .methods
        .approve(
            getContracts()[CONTRACT_TOURNAMENT].options.address,
            web3.utils.toWei('100000', 'ether')
        )
        .send(getTxOptions())
    await getContracts()[CONTRACT_TOKEN]
        .methods
        .approve(
            getContracts()[CONTRACT_TOURNAMENT].options.address,
            web3.utils.toWei('100000', 'ether')
        )
        .send(getTxOptions(user1))
    await getContracts()[CONTRACT_TOKEN]
        .methods
        .approve(
            getContracts()[CONTRACT_TOURNAMENT].options.address,
            web3.utils.toWei('100000', 'ether')
        )
        .send(getTxOptions(user2))
    gasUsage.enterTournament = await estimateGas(
        CONTRACT_TOURNAMENT,
        METHOD_ENTER_TOURNAMENT,
        [
            tournaments[0].id
        ],
        getTxOptions()
    )
    // Add 3 entries to tournaments[0] since minEntry is 3
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .enterTournament(
            tournaments[0].id
        )
        .send(getTxOptions())
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .enterTournament(
            tournaments[0].id
        )
        .send(getTxOptions(user1))
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .enterTournament(
            tournaments[0].id
        )
        .send(getTxOptions(user2))
    gasUsage.completeTournament = await estimateGas(
        CONTRACT_TOURNAMENT,
        METHOD_COMPLETE_TOURNAMENT,
        [
            tournaments[0].id,
            [[0], [1], [2]],
            3
        ],
        getTxOptions()
    )
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .completeTournament(
            tournaments[0].id,
            [[0], [1], [2]],
            3
        )
        .send(getTxOptions())
    gasUsage.claimTournamentPrize = await estimateGas(
        CONTRACT_TOURNAMENT,
        METHOD_CLAIM_TOURNAMENT_PRIZE,
        [
            tournaments[0].id,
            0,
            0
        ],
        getTxOptions()
    )
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .claimTournamentPrize(
            tournaments[0].id,
            0,
            0
        )
        .send(getTxOptions())
    const createTournamentTx2 = await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .createTournament(
            tournaments[2].entryFee,
            tournaments[2].entryLimit,
            tournaments[2].minEntries,
            tournaments[2].maxEntries,
            tournaments[2].rakePercent,
            tournaments[2].prizeType,
            tournaments[2].prizeTable
        )
        .send(getTxOptions())
    tournaments[2].id = createTournamentTx2.outputs[0].events[0].topics[1]
    // Add 2 entries to tournaments[2] since minEntry is 2
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .enterTournament(
            tournaments[2].id
        )
        .send(getTxOptions())
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .enterTournament(
            tournaments[2].id
        )
        .send(getTxOptions(user1))
    // Send complete tournament tx without final standings to cancel tournament
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .completeTournament(
            tournaments[2].id,
            [],
            0
        )
        .send(getTxOptions())
    gasUsage.claimTournamentRefund = await estimateGas(
        CONTRACT_TOURNAMENT,
        METHOD_CLAIM_TOURNAMENT_REFUND,
        [
            tournaments[2].id,
            0
        ],
        getTxOptions()
    )
    await getContracts()[CONTRACT_TOURNAMENT]
        .methods
        .claimTournamentRefund(
            tournaments[2].id,
            0
        )
        .send(getTxOptions())
    console.log('Estimate tournament txns:', gasUsage)
}

;(async () => {
    try {
        chainTag = await web3.eth.getChainTag()
        addPrivateKeysToWallet()
        console.log('Chain tag:', chainTag)
        await estimateAdminTxns()
        await estimateQuestTxns()
        await estimateTournamentTxns()
    } catch (e) {
        console.error(e.stack)
    }
})()