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

    const tournaments = [
        {
            entryFee: web3.utils.toWei('50', 'ether'),
            entryLimit: 1,
            minEntries: 5,
            maxEntries: 30,
            rakePercent: 10,
            prizeType: PRIZE_TYPE_STANDARD,
            prizeTable: prizeTables[0].id,
            id: null
        },
        {
            entryFee: web3.utils.toWei('100', 'ether'),
            entryLimit: 2,
            minEntries: 10,
            maxEntries: 20,
            rakePercent: 20,
            prizeType: PRIZE_TYPE_STANDARD,
            prizeTable: prizeTables[1].id,
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

    const createTournament = async (contract, tournament) =>  {
        const {
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType,
            prizeTable
        } = tournament
        const tx = contract.methods.createTournament(
            entryFee,
            entryLimit,
            minEntries,
            maxEntries,
            rakePercent,
            prizeType,
            prizeTable
        ).send(getDefaultOptions())
        return tx.logs[0].args.id
    }

    this.run = async () => {
        const {
            admin,
            quest,
            token,
            tournament
        } = contracts

        // Add prize tables
        await addPrizeTable(
            tournament,
            prizeTables[0].table
        )

        await addPrizeTable(
            tournament,
            prizeTables[1].table
        )

        // Create tournaments
        tournaments[0].id = await createTournament(
            tournament,
            tournaments[0]
        )
        console.log('Added tournament', tournaments[0])

        tournaments[1].id = await createTournament(
            tournament,
            tournaments[1]
        )
        console.log('Added tournament', tournaments[1])

        // Create quests
    }

}

module.exports = PostMigration