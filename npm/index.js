module.exports = {
    "VERSION": "1.0.8",
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
            "0x27": "0x66Fd024A7D54BF62cA45C7481DD41a605DBfF1D6",
            "0xc7": "0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc",
            "0x4a": "0xE1A9dA3a8E10B74AB05Bc068272254C242DaFb4D",
            "0xa4": "0xd74313287364cA0fd80425d52c6c6B13538c0247"
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
                }, {"name": "count", "type": "uint256"}],
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
                "inputs": [{"indexed": false, "name": "id", "type": "uint256"}],
                "name": "LogCreateUserNode",
                "type": "event",
                "signature": "0xb852525fd4f6e1a23e030cd26f4343dc6e72b6fa902be025e0128cd8b89dc497"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": false, "name": "id", "type": "uint256"}],
                "name": "LogDestroyUserNode",
                "type": "event",
                "signature": "0xf8cc6fb8b259728f3a8d689d5433514b69b755e1cb2a02d711acc01da96f938d"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": false, "name": "id", "type": "uint256"}],
                "name": "LogNewNode",
                "type": "event",
                "signature": "0xfd87414d354ab22a67e24dc515e141be1f584cb4c6ea9f287c1a842be0b330fb"
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
                }, {"name": "rewards", "type": "uint8[]"}],
                "name": "addNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x9c95d6d2"
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
                "inputs": [{"name": "user", "type": "address"}, {"name": "node", "type": "uint256"}],
                "name": "isUserNodeOwner",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x3a8d300e"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "uint256"}],
                "name": "getNodeOwner",
                "outputs": [{"name": "", "type": "address"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x5d3c373f"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "uint256"}],
                "name": "isQuestNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x8a71edcf"
            }, {
                "constant": true,
                "inputs": [{"name": "id", "type": "uint256"}],
                "name": "isTournamentNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x8533022a"
            }]
        }, "address": {"0x27": "0x88909Caa28A0790FfE407b4660a1abBB66072b67"}
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
                    "name": "status",
                    "type": "uint8"
                }, {"name": "refunded", "type": "bool"}],
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
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}],
                "name": "LogCancelQuest",
                "type": "event",
                "signature": "0xccba120f6d8fe88284d3a6ff6cf5540ed5a443face7c093c265d23b12e98556f"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": false, "name": "questEntryCount", "type": "uint256"}],
                "name": "LogCancelQuestEntry",
                "type": "event",
                "signature": "0xd43f34ddf827c966d2587ee907a77cd2f443d8b3b6e4b3ac9ebb188d6acb84c9"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": true, "name": "payer", "type": "address"}, {
                    "indexed": false,
                    "name": "questEntryCount",
                    "type": "uint256"
                }],
                "name": "LogPayForQuest",
                "type": "event",
                "signature": "0xfad6ff84d2baafa62a2688137e151a5f3db368a0a5c695c4f853c1c0ec6b1930"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": false, "name": "questEntryCount", "type": "uint256"}],
                "name": "LogSetQuestOutcome",
                "type": "event",
                "signature": "0x29a22c08933ca898e48dc66d9de22861ce8d7dc3c84c3c7c69c78e9e2b870a0f"
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
                "name": "isActiveNode",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x874fa1a1"
            }]
        },
        "address": {
            "0x27": "0x45072DC2A759E2Dfd0c31cF2A3eF19bca7da6fAf",
            "0xc7": "0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda",
            "0x4a": "0x0E599Dc9e307251729Dbf05Be79E61E0165f3FbF",
            "0xa4": "0x5379897279457f4f8F182f29273E087e505aF8c0"
        }
    },
    "DBETVETTokenContract": {
        "raw": {},
        "address": {
            "0x27": "0x151B77a9AbD9D4b950B2aD87c5E7a35D917FeBa4",
            "0xc7": "0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8",
            "0x4a": "0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8",
            "0xa4": "0x9485cDB237f5B582f86B125CAd32b420Ad46519D"
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
                }, {"name": "uniqueFinalStandings", "type": "uint256"}, {"name": "status", "type": "uint8"}],
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
                }],
                "name": "LogNewPrizeTable",
                "type": "event",
                "signature": "0x01def64f7f3b9d1d5462857c37b202a7450786a4922c3d1dc29ee54efa765a25"
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
                }, {"indexed": true, "name": "entryIndex", "type": "uint256"}],
                "name": "LogEnteredTournament",
                "type": "event",
                "signature": "0x63b13bba6d64871dc901b12d2e356327260de470c659a13964b930dec73cb1c0"
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
                        "name": "finalStandings",
                        "type": "uint256[]"
                    }], "name": "", "type": "tuple"
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
            }]
        },
        "address": {
            "0x27": "0x1D6f5F4b62f2Ddc77826E147179029De67b38029",
            "0xc7": "0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc",
            "0x4a": "0x5dc557E3b082ecA7c6EA890f806F5bddE4D39d50",
            "0xa4": "0x86F3EC2f5C82C86974f2407c0ac9c627015eCcA0"
        }
    }
}