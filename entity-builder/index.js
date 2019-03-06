const fs = require('fs')
const chaintags = {
    testnet: ['0x27'],
    mainnet: ['0x4a', '0xc7'],
    solo: ['0xa4']
}

module.exports = class ContractImportBuilder {
    constructor() {
        this.importOutput = ''
        this.contractImport = {
            VERSION: '1.0.0'
        }
    }

    setOutput(output) {
        this.importOutput = output
    }

    addContract(name, abi, address, chain) {
        let addr = {}

        if (this.importOutput.length < 5) {
            throw new Error(
                'A contract import must be set before using connex contract entity builder'
            )
        }

        // read existing contract
        console.log(abi)

        fs.exists(this.importOutput, exists => {
            if (exists) {
                // const existing = fs.readFileSync(this.importOutput)
                const contractImportExisting = require(this.importOutput)

                // get any existing addresses for the current selected chain
                if (contractImportExisting && contractImportExisting[name]) {
                    addr = contractImportExisting[name].address
                }
            }

            chaintags[chain].forEach(element => {
                addr[element] = address
            })

            this.contractImport[name] = {
                // raw: require(`./build/contracts/${abi.contractName}.json`),
                raw: {
                    abi: abi._jsonInterface
                },
                address: {
                    ...addr
                }
            }

            const output = JSON.stringify(this.contractImport);
            const jsOutput = `module.exports = ${output}`;
            if (this.onWrite) {
                this.onWrite(jsOutput)
            }
        })
    }
}
