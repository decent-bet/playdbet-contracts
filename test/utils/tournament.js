const BigNumber = require('bignumber.js')

const PRIZE_TYPE_STANDARD = 0
const PRIZE_TYPE_WINNER_TAKE_ALL = 1
const PRIZE_TYPE_FIFTY_FIFTY = 2

const getValidPrizeTable = () => {
    return [
        50,
        30,
        20
    ]
}

const getValidTournamentParams = (
    entryLimit,
    prizeType
) => {
    const entryFee = web3.utils.toWei('50', 'ether')
    const minEntries = 1
    const maxEntries = 10
    const rakePercent = 20
    prizeType = prizeType ? prizeType : PRIZE_TYPE_STANDARD
    return {
        entryFee,
        entryLimit,
        minEntries,
        maxEntries,
        rakePercent,
        prizeType
    }
}

const getValidTournamentCompletionParams = () => {
    // Standard
    const finalStandings1 = [[0]] // Indices of entries
    const uniqueFinalStandings1 = 1
    const finalStandings2 = [[0, 1], [0, 1], []] // Final standings for entries in the tournament. Index 1 and 2 share 0th and 1st final standings
    const uniqueFinalStandings2 = 2
    const finalStandings3 = [[0], [1], []]
    const uniqueFinalStandings3 = 2

    // Winner take all
    const finalStandings4 = [[0, 1], [0, 1], [2], [3]] // Index 1 and 2 share 0th and 1st final standings
    const uniqueFinalStandings4 = 3

    // 50-50
    const finalStandings5 = [[2], [5], [6], [7], [9], [0], [1], [3], [4], [8]]
    const uniqueFinalStandings5 = 10
    return {
        finalStandings1,
        uniqueFinalStandings1,
        finalStandings2,
        uniqueFinalStandings2,
        finalStandings3,
        uniqueFinalStandings3,
        finalStandings4,
        uniqueFinalStandings4,
        finalStandings5,
        uniqueFinalStandings5
    }
}

const assertStandardClaimCalculations = (
    postBalance,
    preBalance,
    totalEntryFee,
    finalStandingPercent,
    uniqueFinalStandings,
    excessPrizePercent,
    sharedFinalStandings
) => {
    if(excessPrizePercent) {
        // Calculate excess prize percent per winner from total excess prize percent
        excessPrizePercent =
            new BigNumber(excessPrizePercent)
                .multipliedBy(finalStandingPercent)
                .dividedBy(new BigNumber(100).minus(excessPrizePercent))
    } else
        excessPrizePercent = 0
    const calculatedPrize =
        new BigNumber(totalEntryFee)                    // Total entry fee
            .multipliedBy(0.8)                          // After rake fee
            .multipliedBy(
                new BigNumber(finalStandingPercent)     // Final standing 0 Prize percent
                    .plus(
                        excessPrizePercent
                    )
            )
            .multipliedBy(0.01)                         // Divide by 100 for percent calculation
            .dividedBy(sharedFinalStandings)            // Divide by number of shared final standings
    const calculatedPostBalance =
        new BigNumber(
            preBalance
        ).plus(
            calculatedPrize
        )
    console.log('standard claim', {
        totalEntryFee: totalEntryFee.toString(),
        preBalance: preBalance.toString(),
        postBalance: postBalance.toString(),
        calculatedPostBalance: calculatedPostBalance.toString(),
        calculatedPrize: calculatedPrize.toString(),
        finalStandingPercent,
        uniqueFinalStandings,
        excessPrizePercent: excessPrizePercent.toString(),
        sharedFinalStandings
    })
    assert.equal(
        new BigNumber(
            postBalance
        ).isEqualTo(
            calculatedPostBalance
        ),
        true
    )
}

const assertWinnerTakeAllClaimCalculations = (
    postBalance,
    preBalance,
    totalEntryFee,
    sharedFinalStandings
) => {
    const calculatedPrize =
        new BigNumber(totalEntryFee)                    // Total entry fee
            .multipliedBy(0.8)
            .dividedBy(sharedFinalStandings)            // Divide by number of shared final standings

    const calculatedPostBalance =
        new BigNumber(
            preBalance
        ).plus(
            calculatedPrize
        )

    console.log('winner take all claim', {
        preBalance: preBalance.toString(),
        postBalance: postBalance.toString(),
        calculatedPostBalance: calculatedPostBalance.toString(),
        calculatedPrize: calculatedPrize.toString()
    })
    assert.equal(
        new BigNumber(
            postBalance
        ).isEqualTo(
            calculatedPostBalance
        ),
        true
    )
}

const assertFiftyFiftyClaimCalculations = (
    postBalance,
    preBalance,
    totalEntryFee,
    sharedFinalStandings,
    uniqueFinalStandings
) => {
    const calculatedPrize =
        new BigNumber(totalEntryFee)                    // Total entry fee
            .multipliedBy(0.8)
            .dividedBy(
                new BigNumber(uniqueFinalStandings)     // Divide by number of unique final standings divided by 2
                    .dividedBy(2)
            )
            .dividedBy(sharedFinalStandings)            // Divide by number of shared final standings

    const calculatedPostBalance =
        new BigNumber(
            preBalance
        ).plus(
            calculatedPrize
        )

    console.log('50-50 claim', {
        preBalance: preBalance.toString(),
        postBalance: postBalance.toString(),
        calculatedPostBalance: calculatedPostBalance.toString(),
        calculatedPrize: calculatedPrize.toString()
    })
    assert.equal(
        new BigNumber(
            postBalance
        ).isEqualTo(
            calculatedPostBalance
        ),
        true
    )
}

module.exports = {
    PRIZE_TYPE_WINNER_TAKE_ALL,
    PRIZE_TYPE_STANDARD,
    PRIZE_TYPE_FIFTY_FIFTY,
    getValidPrizeTable,
    getValidTournamentParams,
    getValidTournamentCompletionParams,
    assertStandardClaimCalculations,
    assertWinnerTakeAllClaimCalculations,
    assertFiftyFiftyClaimCalculations
}