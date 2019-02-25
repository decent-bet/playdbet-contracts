const PACKAGE_JSON = require('./package.json')

module.exports = {
    VERSION: PACKAGE_JSON.version,

    DBETVETTokenContract: {
        raw: require('./build/contracts/DBETVETToken.json'),
        address: {
            '0x27': '0x510fCddC9424B1bBb328A574f45BfDdB130e1f03', // Testnet
            '0xc7': '0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8', // Mainnet
            '0x4a': '0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8', // Mainnet
            '0xa4': '0x9485cDB237f5B582f86B125CAd32b420Ad46519D' // Solo
        }
    },
    QuestContract: {
        raw: require('./build/contracts/Quest.json'),
        address: {
            '0x27': '0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda', // Testnet
            '0xc7': '0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda', // Mainnet
            '0x4a': '0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda', // Mainnet
            '0xa4': '0x5379897279457f4f8F182f29273E087e505aF8c0' // Solo
        }
    },
    AdminContract: {
        raw: require('./build/contracts/Admin.json'),
        address: {
            '0x27': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Testnet
            '0xc7': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Mainnet
            '0x4a': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Mainnet
            '0xa4': '0xd74313287364cA0fd80425d52c6c6B13538c0247' // Solo
        }
    },
    TournamentContract: {
        raw: require('./build/contracts/Admin.json'),
        address: {
            '0x27': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Testnet
            '0xc7': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Mainnet
            '0x4a': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Mainnet
            '0xa4': '0x86F3EC2f5C82C86974f2407c0ac9c627015eCcA0' // Solo
        }
    }
}
