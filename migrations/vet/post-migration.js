function PostMigration (
    web3,
    defaultAccount,
    contracts
) {

    const PRIZE_TYPE_STANDARD = 0
    const PRIZE_TYPE_WINNER_TAKE_ALL = 1
    const PRIZE_TYPE_FIFTY_FIFTY = 2

    let prizeTables = [
        {
            table: [50, 30, 20],
            id: null
        },
        {
            table: [60, 20, 15, 5],
            id: null
        }
    ]

    const EMPTY_BYTES_32 = '0x'

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

    const getDefaultOptions = () => {
        return {
            from: defaultAccount,
            gas: 3000000
        }
    }

    const addPrizeTable = async (
        contract,
        prizeTable
    ) => {
        const tx = await contract.methods.createPrizeTable(
            prizeTable
        ).send(getDefaultOptions())
        let logNewPrizeTable
        for(let i = 0; i < contract._jsonInterface.length; i++) {
            if(contract._jsonInterface[i].name === 'LogNewPrizeTable')
                logNewPrizeTable = contract._jsonInterface[i]
        }
        const logs = web3.eth.abi.decodeLog(
            [{
                type: 'bytes32',
                name: 'id',
                indexed: true
            }, {
                type: 'uint256',
                name: 'count',
                indexed: true
            }],
            logNewPrizeTable.signature,
            tx.outputs[0].events[0].topics.slice(1) // First topic is the event signature
        )
        console.log('Added prize table', logs.id)
        return logs.id
    }

    const createTournament = async (
        contract,
        tournament
    ) =>  {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType,
            prizeTable
        } = tournament
        const tx = await contract.methods.createTournament(
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType,
            prizeTable
        ).send(getDefaultOptions())
        let logNewTournament
        for(let i = 0; i < contract._jsonInterface.length; i++) {
            if(contract._jsonInterface[i].name === 'LogNewTournament')
                logNewTournament = contract._jsonInterface[i]
        }
        const logs = web3.eth.abi.decodeLog(
            [{
                type: 'bytes32',
                name: 'id',
                indexed: true
            }, {
                type: 'uint256',
                name: 'count',
                indexed: true
            }],
            logNewTournament.signature,
            tx.outputs[0].events[0].topics.slice(1) // First topic is the event signature
        )
        console.log('Created tournament', logs.id)
        return logs.id
    }

    this.run = async () => {
        const {
            admin,
            quest,
            token,
            tournament
        } = contracts

        // Add prize tables
        tournaments[0].prizeTable = prizeTables[0].id = await addPrizeTable(
            tournament,
            prizeTables[0].table
        )

        tournaments[1].prizeTable = prizeTables[1].id = await addPrizeTable(
            tournament,
            prizeTables[1].table
        )

        // Create tournaments
        tournaments[0].id = await createTournament(
            tournament,
            tournaments[0]
        )

        tournaments[1].id = await createTournament(
            tournament,
            tournaments[1]
        )

        tournaments[2].id = await createTournament(
            tournament,
            tournaments[2]
        )

        tournaments[3].id = await createTournament(
            tournament,
            tournaments[3]
        )

        // Create quests

    }

}

module.exports = PostMigration