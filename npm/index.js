const PACKAGE_JSON = require('./package.json')

module.exports = {
    VERSION: PACKAGE_JSON.version,

    DBETVETTokenContract: {
        raw: require('./build/contracts/DBETVETToken.json'),
        address: {
            '0x27': '0x510fCddC9424B1bBb328A574f45BfDdB130e1f03', // Testnet
            '0xc7': '0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8', // Mainnet
            '0x4a': '0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8', // Mainnet
            '0xa4': '0x2B61c861c38fBAac067e6a447881C4e5D9AdbeeC' // Solo
        }
    },
    QuestContract: {
        raw: require('./build/contracts/Quest.json'),
        address: {
            '0x27': '0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda', // Testnet
            '0xc7': '0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda', // Mainnet
            '0x4a': '0x55db2feE8A2A039BCA83b014cf0b455a31E77Cda', // Mainnet
            '0xa4': '0x04C466da691Cf7B6c1A0352757f405436ba6c08c' // Solo
        }
    },
    AdminContract: {
        raw: require('./build/contracts/Admin.json'),
        address: {
            '0x27': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Testnet
            '0xc7': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Mainnet
            '0x4a': '0x9FD9EaEdCB8621FEc90EE7538B72cde0406396bc', // Mainnet
            '0xa4': '0xBa51DCEAE13514284fBdB8b3d541E225E9a69666' // Solo
        }
    }
}
