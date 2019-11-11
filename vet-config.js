require('dotenv').config()

const {
    MAINNET_HOST,
    MAINNET_PORT,
    MAINNET_GAS_PRICE,
    MAINNET_FROM,
    MAINNET_PRIVATE_KEY
} = process.env

if (
    MAINNET_PRIVATE_KEY && (
        typeof MAINNET_PRIVATE_KEY !== 'string' ||
        MAINNET_PRIVATE_KEY.indexOf(',') === -1 ||
        MAINNET_PRIVATE_KEY.split(',').length !== 2
    )
)
    throw new Error('Invalid main-net private key. Must be a string key or multiple keys separate by commas')


module.exports = {
    chains: {
        testnet: {
            host: "sync-testnet.vechain.org",
            port: null,
            secure: true,
            chain_tag: "0x27",
            gasPrice: '100000000000',
            from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
        },
        solo: {
            host: "localhost",
            port: 8669,
            chain_tag: "0xc7",
            gasPrice: '100000000000',
            from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
        },
        main: {
            host: MAINNET_HOST,
            port: MAINNET_PORT,
            chain_tag: "0x4a",
            gasPrice: MAINNET_GAS_PRICE,
            from: MAINNET_FROM,
            privateKey: MAINNET_PRIVATE_KEY
        }
    }
}
