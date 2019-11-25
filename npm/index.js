module.exports = {
    "VERSION": "1.0.17",
    "AdminContract": {
        "raw": {
            "abi": [{
                "constant": true,
                "inputs": [{"name": "", "type": "address"}],
                "name": "admins",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x429b62e5"
            }, {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x8da5cb5b"
            }, {
                "constant": true,
                "inputs": [],
                "name": "platformWallet",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xfa2af9da"
            }, {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor",
                "signature": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": false, "name": "wallet", "type": "address"}],
                "name": "LogOnSetPlatformWallet",
                "type": "event",
                "signature": "0xaa9453d9836aa10c146f2a0aa7c35172b656f2c25f0fc962345326ea89a8e82e"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "_address", "type": "address"}],
                "name": "LogAddAdmin",
                "type": "event",
                "signature": "0x6b752a74438d47bfe20cac17baf37ecb035071c961f1f9fc463d4f4baf78ce6a"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "_address", "type": "address"}],
                "name": "LogRemoveAdmin",
                "type": "event",
                "signature": "0x78693bd77b9425cf4363f929f93dd7d744f9d7474b3de94b2895020cf56f4a01"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "owner", "type": "address"}],
                "name": "LogNewOwner",
                "type": "event",
                "signature": "0x2c01bb1c7bf9abb56e25ed02c6383c02a0e2c55ebe8745734cc6f849c00b31e4"
            }, {
                "constant": false,
                "inputs": [{"name": "_address", "type": "address"}],
                "name": "addAdmin",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x70480275"
            }, {
                "constant": false,
                "inputs": [{"name": "_address", "type": "address"}],
                "name": "removeAdmin",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x1785f53c"
            }, {
                "constant": false,
                "inputs": [{"name": "_platformWallet", "type": "address"}],
                "name": "setPlatformWallet",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x8831e9cf"
            }, {
                "constant": false,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "setOwner",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x13af4035"
            }]
        },
        "address": {
            "0x27": "0xdB7872f8CE9F09FEb156e5fC4F932ecE13E2a641",
            "0xc7": "0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc",
            "0x4a": "0xE1A9dA3a8E10B74AB05Bc068272254C242DaFb4D",
            "0xa4": "0xbAa4774602Dc5571FebcEa7D3cf966297Cb3f1BF"
        }
    },
    "DBETNode": {
        "raw": {
            "abi": [{
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}],
                "name": "nodes",
                "outputs": [{"name": "name", "type": "string"}, {
                    "name": "tokenThreshold",
                    "type": "uint256"
                }, {"name": "timeThreshold", "type": "uint256"}, {
                    "name": "maxCount",
                    "type": "uint256"
                }, {"name": "entryFeeDiscount", "type": "uint256"}, {
                    "name": "increasedPrizePayout",
                    "type": "uint256"
                }, {"name": "count", "type": "uint256"}, {"name": "nodeType", "type": "uint8"}, {
                    "name": "deprecated",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x1c53c280"
            }, {
                "constant": true,
                "inputs": [],
                "name": "tournament",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x1e0197e2"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}],
                "name": "userNodes",
                "outputs": [{"name": "node", "type": "uint256"}, {
                    "name": "owner",
                    "type": "address"
                }, {"name": "deposit", "type": "uint256"}, {
                    "name": "creationTime",
                    "type": "uint256"
                }, {"name": "destroyTime", "type": "uint256"}, {"name": "index", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x3badaecb"
            }, {
                "constant": true,
                "inputs": [],
                "name": "quest",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x42cccf08"
            }, {
                "constant": true,
                "inputs": [],
                "name": "userNodeCount",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x51964f3a"
            }, {
                "constant": true,
                "inputs": [],
                "name": "nodeCount",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x6da49b83"
            }, {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x8da5cb5b"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "address"}],
                "name": "nodeOwnership",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xac05a44d"
            }, {
                "constant": true,
                "inputs": [],
                "name": "nodeWallet",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xecded914"
            }, {
                "constant": true,
                "inputs": [],
                "name": "admin",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xf851a440"
            }, {
                "constant": true,
                "inputs": [],
                "name": "token",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xfc0c546a"
            }, {
                "inputs": [{"name": "_admin", "type": "address"}, {"name": "_token", "type": "address"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor",
                "signature": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": false, "name": "quest", "type": "address"}, {
                    "indexed": false,
                    "name": "tournament",
                    "type": "address"
                }],
                "name": "LogSetContracts",
                "type": "event",
                "signature": "0xc8ac2a6c11cbd4da449119940b906ecd3f5dcf48fec513b91d3adffe3cdf2493"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "uint256"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }],
                "name": "LogCreateUserNode",
                "type": "event",
                "signature": "0x45b9bae30cde858c2e22536f48cf48b7ddcf275b8c2ba5edab7bc969d600d975"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "uint256"}, {
                    "indexed": true,
                    "name": "previousNodeType",
                    "type": "uint256"
                }, {"indexed": true, "name": "newNodeType", "type": "uint256"}],
                "name": "LogUpgradeUserNode",
                "type": "event",
                "signature": "0x0dd9a48df69e33423c399bd9cd993b74dcd7d7463400ccd0b1d19e2ceb83dca3"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "uint256"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }],
                "name": "LogDestroyUserNode",
                "type": "event",
                "signature": "0x3376c15012e84e96494909f552c426052f0cf2d207b963d5bb16470e9734d180"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "uint256"}, {
                    "indexed": true,
                    "name": "nodeType",
                    "type": "uint8"
                }],
                "name": "LogNewNode",
                "type": "event",
                "signature": "0xc2534f6a446b4ab6fbba2bc99c5f88915195345f4a13e909e323ff656bce5882"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "uint256"}],
                "name": "LogDeprecatedNode",
                "type": "event",
                "signature": "0x343996fb6a78d672d92fe175deb9278e646a31ec144c0d8367a046097c6c55f1"
            }, {
                "constant": false,
                "inputs": [{"name": "_quest", "type": "address"}, {"name": "_tournament", "type": "address"}],
                "name": "setContracts",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xd8952a49"
            }, {
                "constant": false,
                "inputs": [{"name": "node", "type": "uint256"}],
                "name": "create",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x780900dc"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "uint256"}, {"name": "upgradeNodeType", "type": "uint256"}],
                "name": "upgrade",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x451450ec"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "uint256"}],
                "name": "destroy",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x9d118770"
            }, {
                "constant": false,
                "inputs": [{"name": "name", "type": "string"}, {
                    "name": "tokenThreshold",
                    "type": "uint256"
                }, {"name": "timeThreshold", "type": "uint256"}, {
                    "name": "maxCount",
                    "type": "uint256"
                }, {"name": "rewards", "type": "uint8[]"}, {
                    "name": "entryFeeDiscount",
                    "type": "uint256"
                }, {"name": "increasedPrizePayout", "type": "uint256"}, {"name": "nodeType", "type": "uint8"}],
                "name": "addNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x32ea73a0"
            }, {
                "constant": false,
                "inputs": [{"name": "node", "type": "uint256"}],
                "name": "deprecateNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xc6b8774b"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "uint256"}],
                "name": "isUserNodeActivated",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xfe12bdd6"
            }, {
                "constant": true,
                "inputs": [{"name": "userNodeId", "type": "uint256"}],
                "name": "getNodeOwner",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x5d3c373f"
            }, {
                "constant": true,
                "inputs": [{"name": "userNodeId", "type": "uint256"}, {"name": "reward", "type": "uint8"}],
                "name": "checkForNodeReward",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x37ea2506"
            }, {
                "constant": true,
                "inputs": [{"name": "userNodeId", "type": "uint256"}],
                "name": "isQuestNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x8a71edcf"
            }, {
                "constant": true,
                "inputs": [{"name": "userNodeId", "type": "uint256"}],
                "name": "isTournamentNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x8533022a"
            }, {
                "constant": true,
                "inputs": [{"name": "userNodeId", "type": "uint256"}],
                "name": "isIncreasedPrizePayoutNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x7d434b2d"
            }, {
                "constant": true,
                "inputs": [{"name": "userNodeId", "type": "uint256"}],
                "name": "isEntryFeeDiscountNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xc2aa9259"
            }]
        },
        "address": {
            "0x27": "0x12f588cf9eAaDB2175d41180921d6D9b134c8484",
            "0xa4": "0xA867c87682D7c5ebe92046D1ddd9F1930B8B55BC"
        }
    },
    "NodeWallet": {
        "raw": {
            "abi": [{
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "bytes32"}],
                "name": "prizeFund",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x319e46f5"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}],
                "name": "totalCompletedQuestPrizePayouts",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x46fb2cae"
            }, {
                "constant": true,
                "inputs": [],
                "name": "dbetNode",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x53f7eb90"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}],
                "name": "totalRakeFees",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x7308a021"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "bytes32"}],
                "name": "questFees",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x9236f624"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "bytes32"}],
                "name": "rakeFees",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xc4ded9d5"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}],
                "name": "totalCompletedQuestEntryFees",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xc91a64a0"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}],
                "name": "totalQuestEntryFees",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xceaac89f"
            }, {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "nodeId", "type": "uint256"}, {
                    "indexed": true,
                    "name": "questId",
                    "type": "bytes32"
                }],
                "name": "LogSetPrizeFund",
                "type": "event",
                "signature": "0x0139e7e874fbcf19d90f8ad114d5f294ee5e36c2a92da5334a42c97268f0030f"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "nodeId", "type": "uint256"}, {
                    "indexed": true,
                    "name": "questId",
                    "type": "bytes32"
                }],
                "name": "LogAddQuestEntryFee",
                "type": "event",
                "signature": "0x00a6b81229b4ebfc07e6b9a7de389506517383dd38a76ebf60ee23986ad01c35"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "nodeId", "type": "uint256"}, {
                    "indexed": true,
                    "name": "questId",
                    "type": "bytes32"
                }],
                "name": "LogAddCompletedQuestEntryFee",
                "type": "event",
                "signature": "0x7501ebdab1c1f68475f61e42ef7b4d8ac330131e2202bed3c85a4ad1f17359a4"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "nodeId", "type": "uint256"}, {
                    "indexed": true,
                    "name": "questId",
                    "type": "bytes32"
                }],
                "name": "LogClaimRefund",
                "type": "event",
                "signature": "0xf7ab3c1383080a8912888a37804d4153bb74e80eb73ed44131a8e15c5726ab2d"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "nodeId", "type": "uint256"}, {
                    "indexed": true,
                    "name": "amount",
                    "type": "uint256"
                }],
                "name": "LogWithdrawCompletedQuestEntryFees",
                "type": "event",
                "signature": "0x2ddd7d38c89622e82ff6893431cff5d4f115d3e3b0e8c5871c854e593a60f256"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "nodeId", "type": "uint256"}, {
                    "indexed": true,
                    "name": "tournamentId",
                    "type": "bytes32"
                }],
                "name": "LogAddTournamentRakeFees",
                "type": "event",
                "signature": "0x3090809ec27599283b97ee582f754e77fdf6b508a81ed0725e9d988a182fff48"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "nodeId", "type": "uint256"}, {
                    "indexed": true,
                    "name": "amount",
                    "type": "uint256"
                }],
                "name": "LogWithdrawTournamentRakeFees",
                "type": "event",
                "signature": "0x4b1caf238fdd995ea2c279896256e886e9f8488a7ae3aab750165b9cd3652291"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}, {
                    "name": "questId",
                    "type": "bytes32"
                }, {"name": "fund", "type": "uint256"}],
                "name": "setPrizeFund",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xd614ef25"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}, {
                    "name": "questId",
                    "type": "bytes32"
                }, {"name": "fee", "type": "uint256"}],
                "name": "addQuestEntryFee",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x114b69dc"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}, {
                    "name": "questId",
                    "type": "bytes32"
                }, {"name": "fee", "type": "uint256"}, {"name": "prize", "type": "uint256"}],
                "name": "completeQuest",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x574f7ef5"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}, {
                    "name": "questId",
                    "type": "bytes32"
                }, {"name": "fee", "type": "uint256"}],
                "name": "claimRefund",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x5e2d7f12"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}],
                "name": "withdrawCompletedQuestEntryFees",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xc4585d61"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}, {
                    "name": "tournamentId",
                    "type": "bytes32"
                }, {"name": "rakeFee", "type": "uint256"}],
                "name": "addTournamentRakeFee",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xa49e22e5"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}],
                "name": "withdrawTournamentRakeFees",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x13406de4"
            }]
        },
        "address": {
            "0x27": "0x7e9643bAe6a6aed2Bc9Fe1e1a4f119FA0b1ff5B9",
            "0xc7": "0x9E46b0e72052d8caa86B9633988F603973591c1D",
            "0x4a": "0x9E46b0e72052d8caa86B9633988F603973591c1D",
            "0xa4": "0x9E46b0e72052d8caa86B9633988F603973591c1D"
        }
    },
    "QuestContract": {
        "raw": {
            "abi": [{
                "constant": true,
                "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "bytes32"}, {
                    "name": "",
                    "type": "uint256"
                }],
                "name": "userQuestEntries",
                "outputs": [{"name": "entryTime", "type": "uint256"}, {
                    "name": "entryFee",
                    "type": "uint256"
                }, {"name": "status", "type": "uint8"}, {"name": "nodeId", "type": "uint256"}, {
                    "name": "refunded",
                    "type": "bool"
                }, {"name": "payer", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x13ecb607"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "bytes32"}],
                "name": "quests",
                "outputs": [{"name": "isNode", "type": "bool"}, {
                    "name": "nodeId",
                    "type": "uint256"
                }, {"name": "entryFee", "type": "uint256"}, {"name": "prize", "type": "uint256"}, {
                    "name": "status",
                    "type": "uint8"
                }, {"name": "maxEntries", "type": "uint256"}, {"name": "count", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x487bf905"
            }, {
                "constant": true,
                "inputs": [],
                "name": "dbetNode",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x53f7eb90"
            }, {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x8da5cb5b"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "bytes32"}],
                "name": "userQuestEntryCount",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xd6f75d04"
            }, {
                "constant": true,
                "inputs": [],
                "name": "admin",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xf851a440"
            }, {
                "constant": true,
                "inputs": [],
                "name": "token",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xfc0c546a"
            }, {
                "inputs": [{"name": "_admin", "type": "address"}, {
                    "name": "_token",
                    "type": "address"
                }, {"name": "_dbetNode", "type": "address"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor",
                "signature": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}],
                "name": "LogNewQuest",
                "type": "event",
                "signature": "0x06809877c9cf1ec1fd8430c60fda9db629d86f4ed619153f7f08dd798dc416cd"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "canceller",
                    "type": "address"
                }],
                "name": "LogCancelQuest",
                "type": "event",
                "signature": "0xe6a521cee0881c61a431cc7d900384e89ee2735dcaaa0b4c1c51418c8806607e"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": false, "name": "questEntryCount", "type": "uint256"}, {
                    "indexed": true,
                    "name": "canceller",
                    "type": "address"
                }],
                "name": "LogCancelQuestEntry",
                "type": "event",
                "signature": "0xb65c6c0596720a7ad00963e6623b81f19b11a97a6f697d7659e6494ac66f4383"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": true, "name": "payer", "type": "address"}, {
                    "indexed": false,
                    "name": "entryFee",
                    "type": "uint256"
                }, {"indexed": false, "name": "questEntryCount", "type": "uint256"}],
                "name": "LogPayForQuest",
                "type": "event",
                "signature": "0xb623f46755c30a01b522f9097474004c7f013ae124cd3688c18df7a03bf8fc5e"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": true, "name": "prizePayer", "type": "address"}, {
                    "indexed": false,
                    "name": "questEntryCount",
                    "type": "uint256"
                }],
                "name": "LogSetQuestOutcome",
                "type": "event",
                "signature": "0x33ff8f76368c21e2ac10162237df6279a569cc3f81173b3a49f94e7d564d76ad"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": false, "name": "isQuestCancelled", "type": "bool"}, {
                    "indexed": false,
                    "name": "questEntryCount",
                    "type": "uint256"
                }],
                "name": "LogRefundQuestEntry",
                "type": "event",
                "signature": "0x5b7710ea6d7424ae872b2e974e604e97f45290e8b51581ed7ea78a120575550a"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "entryFee", "type": "uint256"}, {
                    "name": "prize",
                    "type": "uint256"
                }],
                "name": "addQuest",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xe0be6741"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}, {
                    "name": "id",
                    "type": "bytes32"
                }, {"name": "entryFee", "type": "uint256"}, {"name": "prize", "type": "uint256"}, {
                    "name": "maxEntries",
                    "type": "uint256"
                }],
                "name": "addNodeQuest",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xe5a49d5b"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "user", "type": "address"}],
                "name": "payForQuest",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x7e5a78a2"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "nodeId", "type": "uint256"}, {
                    "name": "user",
                    "type": "address"
                }],
                "name": "payForQuestWithNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xcecdd6fd"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "user", "type": "address"}, {
                    "name": "outcome",
                    "type": "uint8"
                }],
                "name": "setQuestOutcome",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x6fc82f0b"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}],
                "name": "cancelQuest",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xc0174542"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}, {"name": "id", "type": "bytes32"}],
                "name": "cancelNodeQuest",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xb24a5166"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "user", "type": "address"}],
                "name": "cancelQuestEntry",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x2ba720e8"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "user", "type": "address"}],
                "name": "claimRefund",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xc6b49688"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "user", "type": "address"}],
                "name": "claimRefundForEntry",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xf97ec050"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "uint256"}, {"name": "nodeOwner", "type": "address"}],
                "name": "isActiveHouseNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xbbd31d73"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "uint256"}, {"name": "nodeOwner", "type": "address"}],
                "name": "isActiveEntryFeeDiscountNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x1f63c3be"
            }, {
                "constant": true,
                "inputs": [{"name": "nodeType", "type": "uint256"}, {"name": "entryFee", "type": "uint256"}],
                "name": "getEntryFeeForNodeType",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x5ab6f638"
            }, {
                "constant": true,
                "inputs": [{"name": "nodeType", "type": "uint256"}, {"name": "prize", "type": "uint256"}],
                "name": "getPrizePayoutForNodeType",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xa7457aa2"
            }]
        },
        "address": {
            "0x27": "0xDe21F0870126b619e257a565E6cD51D37f90bc45",
            "0xc7": "0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda",
            "0x4a": "0x0E599Dc9e307251729Dbf05Be79E61E0165f3FbF",
            "0xa4": "0x975f12947bA0654a56873F8236E5c9b5C498c874"
        }
    },
    "DBETVETTokenContract": {
        "raw": {
            "abi": [{
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [{"name": "", "type": "string"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x06fdde03"
            }, {
                "constant": false,
                "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
                "name": "approve",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x095ea7b3"
            }, {
                "constant": true,
                "inputs": [],
                "name": "dbetTeam",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x0a96fa20"
            }, {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x18160ddd"
            }, {
                "constant": false,
                "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "transferFrom",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x23b872dd"
            }, {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{"name": "", "type": "uint8"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x313ce567"
            }, {
                "constant": false,
                "inputs": [{"name": "_value", "type": "uint256"}],
                "name": "burn",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x42966c68"
            }, {
                "constant": false,
                "inputs": [{"name": "_spender", "type": "address"}, {"name": "_subtractedValue", "type": "uint256"}],
                "name": "decreaseApproval",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x66188463"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "uint256"}],
                "name": "tokenGrants",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x6fc559bb"
            }, {
                "constant": true,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x70a08231"
            }, {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{"name": "", "type": "string"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x95d89b41"
            }, {
                "constant": false,
                "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
                "name": "transfer",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xa9059cbb"
            }, {
                "constant": false,
                "inputs": [{"name": "_spender", "type": "address"}, {"name": "_addedValue", "type": "uint256"}],
                "name": "increaseApproval",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xd73dd623"
            }, {
                "constant": true,
                "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
                "name": "allowance",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xdd62ed3e"
            }, {
                "inputs": [{"name": "_name", "type": "string"}, {
                    "name": "_symbol",
                    "type": "string"
                }, {"name": "_decimals", "type": "uint8"}, {"name": "_totalSupply", "type": "uint256"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor",
                "signature": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": false, "name": "index", "type": "uint256"}, {
                    "indexed": false,
                    "name": "amount",
                    "type": "uint256"
                }, {"indexed": false, "name": "_to", "type": "address"}, {
                    "indexed": false,
                    "name": "_from",
                    "type": "address"
                }],
                "name": "LogGrantTokens",
                "type": "event",
                "signature": "0x405c2dc91aebb392f583b128eacb38245351162ff4559a303e7d6dfe7bd406f7"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "burner", "type": "address"}, {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }],
                "name": "Burn",
                "type": "event",
                "signature": "0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                }, {"indexed": false, "name": "value", "type": "uint256"}],
                "name": "Approval",
                "type": "event",
                "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "from", "type": "address"}, {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                }, {"indexed": false, "name": "value", "type": "uint256"}],
                "name": "Transfer",
                "type": "event",
                "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            }, {
                "constant": false,
                "inputs": [{"name": "index", "type": "uint256"}, {"name": "_value", "type": "uint256"}, {
                    "name": "_to",
                    "type": "address"
                }],
                "name": "grantTokens",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xec680c49"
            }]
        },
        "address": {
            "0x27": "0x151B77a9AbD9D4b950B2aD87c5E7a35D917FeBa4",
            "0xc7": "0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8",
            "0x4a": "0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8",
            "0xa4": "0x56631CF7AB2deFef7525837ed2f85e9A6Aca28Ec"
        }
    },
    "TournamentContract": {
        "raw": {
            "abi": [{
                "constant": true,
                "inputs": [{"name": "", "type": "bytes32"}],
                "name": "tournaments",
                "outputs": [{"name": "isNode", "type": "bool"}, {
                    "name": "nodeId",
                    "type": "uint256"
                }, {
                    "components": [{"name": "entryFee", "type": "uint256"}, {
                        "name": "entryLimit",
                        "type": "uint256"
                    }, {"name": "minEntries", "type": "uint256"}, {
                        "name": "maxEntries",
                        "type": "uint256"
                    }, {"name": "rakePercent", "type": "uint256"}, {
                        "name": "prizeType",
                        "type": "uint8"
                    }, {"name": "prizeTable", "type": "bytes32"}], "name": "details", "type": "tuple"
                }, {"name": "totalEntryFees", "type": "uint256"}, {
                    "name": "uniqueFinalStandings",
                    "type": "uint256"
                }, {"name": "status", "type": "uint8"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x139cfab1"
            }, {
                "constant": true,
                "inputs": [],
                "name": "dbetNode",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x53f7eb90"
            }, {
                "constant": true,
                "inputs": [],
                "name": "tournamentCount",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x6e2b2c7c"
            }, {
                "constant": true,
                "inputs": [],
                "name": "prizeTableCount",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x7f606666"
            }, {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x8da5cb5b"
            }, {
                "constant": true,
                "inputs": [{"name": "", "type": "bytes32"}, {"name": "", "type": "uint256"}],
                "name": "prizeTables",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xc3d18064"
            }, {
                "constant": true,
                "inputs": [],
                "name": "admin",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xf851a440"
            }, {
                "constant": true,
                "inputs": [],
                "name": "token",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xfc0c546a"
            }, {
                "inputs": [{"name": "_admin", "type": "address"}, {
                    "name": "_token",
                    "type": "address"
                }, {"name": "_dbetNode", "type": "address"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor",
                "signature": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "count",
                    "type": "uint256"
                }, {"indexed": false, "name": "tableLength", "type": "uint256"}],
                "name": "LogNewPrizeTable",
                "type": "event",
                "signature": "0x8672fa1c21e5e2c681a9cdeb6bab51d7b92fe1998b6f6789f7ffa185714e56c5"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "count",
                    "type": "uint256"
                }],
                "name": "LogNewTournament",
                "type": "event",
                "signature": "0x397d4a2fe9561dded5b33b9ef6341bb5b4d59518aecd13e6b575ffde48ac79ec"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "participant",
                    "type": "address"
                }, {"indexed": true, "name": "entryIndex", "type": "uint256"}, {
                    "indexed": false,
                    "name": "entryFee",
                    "type": "uint256"
                }],
                "name": "LogEnteredTournament",
                "type": "event",
                "signature": "0x954bc578844efd2bc38f682c0fc6072587fd0dab5ac594f5e1682c31d3dd7dae"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "status",
                    "type": "uint8"
                }],
                "name": "LogCompletedTournament",
                "type": "event",
                "signature": "0xd61e00e0d2ae86e03c138a28a449a52725c37c152c6c654cf01414f126432a6a"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": false,
                    "name": "entryIndex",
                    "type": "uint256"
                }, {"indexed": false, "name": "finalStanding", "type": "uint256"}, {
                    "indexed": false,
                    "name": "prizeFromTable",
                    "type": "uint256"
                }, {"indexed": false, "name": "prizeMoney", "type": "uint256"}],
                "name": "LogClaimedTournamentPrize",
                "type": "event",
                "signature": "0x88063a8d2ab7477c3378c03f860539bcea09c362ea763ce48222750919c08f33"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": false,
                    "name": "entryIndex",
                    "type": "uint256"
                }],
                "name": "LogRefundedTournamentEntry",
                "type": "event",
                "signature": "0xee416b1ab56f915dd10c5d167030769205efc15d146641e0e25a7f45794b9f34"
            }, {
                "constant": false,
                "inputs": [{"name": "table", "type": "uint256[]"}],
                "name": "createPrizeTable",
                "outputs": [{"name": "", "type": "bytes32"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x05114bf9"
            }, {
                "constant": false,
                "inputs": [{"name": "entryFee", "type": "uint256"}, {
                    "name": "entryLimit",
                    "type": "uint256"
                }, {"name": "minEntries", "type": "uint256"}, {
                    "name": "maxEntries",
                    "type": "uint256"
                }, {"name": "rakePercent", "type": "uint256"}, {
                    "name": "prizeType",
                    "type": "uint8"
                }, {"name": "prizeTable", "type": "bytes32"}],
                "name": "createTournament",
                "outputs": [{"name": "", "type": "bytes32"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x8e285bb7"
            }, {
                "constant": false,
                "inputs": [{"name": "nodeId", "type": "uint256"}, {
                    "name": "entryFee",
                    "type": "uint256"
                }, {"name": "entryLimit", "type": "uint256"}, {
                    "name": "minEntries",
                    "type": "uint256"
                }, {"name": "maxEntries", "type": "uint256"}, {
                    "name": "rakePercent",
                    "type": "uint256"
                }, {"name": "prizeType", "type": "uint8"}, {"name": "prizeTable", "type": "bytes32"}],
                "name": "createNodeTournament",
                "outputs": [{"name": "", "type": "bytes32"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x6567cc53"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}],
                "name": "enterTournament",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xf34e55de"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "nodeId", "type": "uint256"}],
                "name": "enterTournamentWithNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x99c22c5b"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {
                    "name": "finalStandings",
                    "type": "uint256[][]"
                }, {"name": "uniqueFinalStandings", "type": "uint256"}],
                "name": "completeTournament",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x7a467a15"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {
                    "name": "entryIndex",
                    "type": "uint256"
                }, {"name": "finalStandingIndex", "type": "uint256"}],
                "name": "claimTournamentPrize",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x4f231b59"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "finalStanding", "type": "uint256"}],
                "name": "_calculatePrizeMoney",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xdf18f873"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "finalStanding", "type": "uint256"}],
                "name": "_calculatePrizeMoneyForStandardPrizeType",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xae6bee7d"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "finalStanding", "type": "uint256"}],
                "name": "_calculatePrizeMoneyForWinnerTakeAllPrizeType",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x2cebde6a"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "finalStanding", "type": "uint256"}],
                "name": "_calculatePrizeMoneyForFiftyFiftyPrizeType",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xe4020dc7"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "entryIndex", "type": "uint256"}],
                "name": "claimTournamentRefund",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x8d44539f"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}],
                "name": "getPrizePool",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x45c6f9de"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}],
                "name": "getRakeFee",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x78fda683"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "entryIndex", "type": "uint256"}],
                "name": "getTournamentEntry",
                "outputs": [{
                    "components": [{"name": "_address", "type": "address"}, {
                        "name": "entryFee",
                        "type": "uint256"
                    }, {"name": "finalStandings", "type": "uint256[]"}], "name": "", "type": "tuple"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xf89e1878"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "entryIndex", "type": "uint256"}],
                "name": "getTournamentEntryFinalStandingLength",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x7c32bcd3"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {
                    "name": "entryIndex",
                    "type": "uint256"
                }, {"name": "finalStandingIndex", "type": "uint256"}],
                "name": "getTournamentFinalStanding",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x7023387b"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "finalStanding", "type": "uint256"}],
                "name": "getTournamentPrizeWinnersLength",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xed2639c7"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "bytes32"}, {
                    "name": "finalStanding",
                    "type": "uint256"
                }, {"name": "prizeWinnerIndex", "type": "uint256"}],
                "name": "getTournamentPrizeWinnerAtIndex",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0xabead059"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "uint256"}, {"name": "nodeOwner", "type": "address"}],
                "name": "isActiveNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x874fa1a1"
            }, {
                "constant": true,
                "inputs": [{"name": "nodeType", "type": "uint256"}, {"name": "entryFee", "type": "uint256"}],
                "name": "getEntryFeeForNodeType",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x5ab6f638"
            }]
        },
        "address": {
            "0x27": "0x0EA6541cAD71ef50fba959fa9C37AeC8Bf310612",
            "0xc7": "0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc",
            "0x4a": "0x5dc557E3b082ecA7c6EA890f806F5bddE4D39d50",
            "0xa4": "0xacc34b6a1FcC2cBE08b08f2db9b023Dcdb6C6Fc4"
        }
    }
}