import { ContractAbi } from 'ethereum-protocol'

type ContractWrapper = {
    raw: {
        abi: ContractAbi
    }

    address: {
        /**
         * Testnet Address
         */
        '0x27': string

        /**
         * Mainnet Address
         */
        '0xc7': string

        /**
         * Mainnet Address
         */
        '0x4a': string

        /**
         * Thor Snapshot Address
         */
        '0xa4': string
    }
}

export declare const DBETVETTokenContract: ContractWrapper
export declare const QuestContract: ContractWrapper
export declare const AdminContract: ContractWrapper
export declare const TournamentContract: ContractWrapper
export declare const DBETNode: ContractWrapper;
export declare const NodeWallet: ContractWrapper;
export declare const VERSION: string
