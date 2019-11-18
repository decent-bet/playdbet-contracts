const REWARD_ENTRY_FEE_DISCOUNT = 0
const REWARD_INCREASED_PRIZE_PAYOUTS = 1
const REWARD_INCREASED_REFER_A_FRIEND = 2
const REWARD_CREATE_QUEST = 3
const REWARD_CREATE_PRIVATE_QUEST = 4
const REWARD_CREATE_WHITELIST_QUEST = 5
const REWARD_CREATE_TOURNAMENT = 6

const NODE_TYPE_HOUSE = 0
const NODE_TYPE_REWARD = 1

const houseRewards = [
    REWARD_CREATE_QUEST,
    REWARD_CREATE_PRIVATE_QUEST,
    REWARD_CREATE_WHITELIST_QUEST,
    REWARD_CREATE_TOURNAMENT
]

const increasedPrizePayoutRewards = [
    REWARD_ENTRY_FEE_DISCOUNT,
    REWARD_INCREASED_PRIZE_PAYOUTS,
    REWARD_INCREASED_REFER_A_FRIEND
]

const allRewards = [
    ...houseRewards,
    ...increasedPrizePayoutRewards
]

const getHouseNode = () => {
    return {
        name: 'House',
        tokenThreshold: web3.utils.toWei('100000', 'ether'), // 100k DBETs
        timeThreshold: 86400 * 7, // 1 week
        maxCount: 10,
        rewards: houseRewards,
        entryFeeDiscount: 10,
        increasedPrizePayout: 10,
        nodeType: NODE_TYPE_HOUSE
    }
}

const getRewardNode = () => {
    return {
        name: 'Reward',
        tokenThreshold: web3.utils.toWei('100000', 'ether'), // 100k DBETs
        timeThreshold: 86400 * 7, // 1 week
        maxCount: 10,
        rewards: increasedPrizePayoutRewards,
        entryFeeDiscount: 10,
        increasedPrizePayout: 10,
        nodeType: NODE_TYPE_REWARD
    }
}

const getUpgradedNode = () => {
    return {
        name: 'Upgraded',
        tokenThreshold: web3.utils.toWei('200000', 'ether'), // 100k DBETs
        timeThreshold: 86400 * 14, // 2 weeks
        maxCount: 5,
        rewards: allRewards,
        entryFeeDiscount: 25,
        increasedPrizePayout: 25,
        nodeType: NODE_TYPE_HOUSE
    }
}

const getValidNodeQuestParams = () => {
    const id = web3.utils.fromUtf8('456')
    const entryFee = web3.utils.toWei('200', 'ether')
    const prize = web3.utils.toWei('1000', 'ether')
    const maxEntries = 100;

    return {
        id,
        entryFee,
        prize,
        maxEntries
    }
}

module.exports = {
    REWARD_ENTRY_FEE_DISCOUNT,
    REWARD_INCREASED_PRIZE_PAYOUTS,
    REWARD_INCREASED_REFER_A_FRIEND,
    REWARD_CREATE_QUEST,
    REWARD_CREATE_PRIVATE_QUEST,
    REWARD_CREATE_WHITELIST_QUEST,
    REWARD_CREATE_TOURNAMENT,
    houseRewards,
    increasedPrizePayoutRewards,
    getHouseNode,
    getRewardNode,
    getUpgradedNode,
    getValidNodeQuestParams
}