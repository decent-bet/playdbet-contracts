module.exports = {
    "VERSION": "1.0.4",
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
            "0x27": "0xD4275B0C2452cee50285640171219B36366A7610",
            "0xc7": "0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc",
            "0x4a": "0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc",
            "0xa4": "0xd74313287364cA0fd80425d52c6c6B13538c0247"
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
                "outputs": [{"name": "entryFee", "type": "uint256"}, {
                    "name": "timeToComplete",
                    "type": "uint256"
                }, {"name": "prize", "type": "uint256"}, {"name": "status", "type": "uint8"}, {
                    "name": "count",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function",
                "signature": "0x487bf905"
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
                "inputs": [{"name": "_admin", "type": "address"}, {"name": "_token", "type": "address"}],
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
                }],
                "name": "LogCancelQuestEntry",
                "type": "event",
                "signature": "0x1b2965240d28519adbcbda00f7662ff7d4c77e83ba5c966961c54991631c9a14"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": true, "name": "payer", "type": "address"}],
                "name": "LogPayForQuest",
                "type": "event",
                "signature": "0xa9842130ad9b2499cdf52013ef90cd5a1fb6fbe94d684822170d75bf04bf927e"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }],
                "name": "LogSetQuestOutcome",
                "type": "event",
                "signature": "0x09d256a4751f55a6e85624a990d7b943e8db25776fd0d097c9669b6c47f62844"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "id", "type": "bytes32"}, {
                    "indexed": true,
                    "name": "user",
                    "type": "address"
                }, {"indexed": false, "name": "isQuestCancelled", "type": "bool"}],
                "name": "LogRefundQuestEntry",
                "type": "event",
                "signature": "0x8fe840560cb6e17cf4642003022d241ddce6126b7015e35aa1173df8a34a4ccc"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}, {
                    "name": "entryFee",
                    "type": "uint256"
                }, {"name": "timeToComplete", "type": "uint256"}, {"name": "prize", "type": "uint256"}],
                "name": "addQuest",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0xb18a5c58"
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
                "inputs": [{"name": "id", "type": "bytes32"}, {"name": "user", "type": "address"}],
                "name": "cancelQuestEntry",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x2ba720e8"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}],
                "name": "claimRefund",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x71de2ffc"
            }, {
                "constant": false,
                "inputs": [{"name": "id", "type": "bytes32"}],
                "name": "claimRefundForEntry",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function",
                "signature": "0x1ff93c7d"
            }]
        },
        "address": {
            "0x27": "0xb756b21F024b30f8694027162e249f2cFfD0dE46",
            "0xc7": "0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda",
            "0x4a": "0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda",
            "0xa4": "0x5379897279457f4f8F182f29273E087e505aF8c0"
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
            "0x27": "0x7f670e8F98EfC0D2c48839a264f744ca2F79fFe0",
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
                "outputs": [{
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
                "inputs": [{"name": "_admin", "type": "address"}, {"name": "_token", "type": "address"}],
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
            }]
        },
        "address": {
            "0x27": "0xa0cC680f0565beFeB548A31f1BC0b60C0B5012C4",
            "0xc7": "0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc",
            "0x4a": "0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc",
            "0xa4": "0x86F3EC2f5C82C86974f2407c0ac9c627015eCcA0"
        }
    }
}