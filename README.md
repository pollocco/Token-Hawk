# Token Hawk

![Screenshot from 2022-06-05 13-25-41](https://user-images.githubusercontent.com/58239644/172065679-3295d925-e642-45d7-b205-07ba32c7199f.png)

A scanner for new tokens on the Binance Smart Chain and Ethereum networks.

Written in TypeScript.

## Installation

Clone the repo to a folder of your choice. Then,`npm install` in the root of the repository.

### API Keys

This project requires several API keys in order to run properly. It also requires a pre-existing BSC or ETH wallet ([MetaMask](https://metamask.io/) is an easy way to get one).†

† *No token transactions are performed using the wallet. Rather, the Web3 plugin uses the wallet to query the blockchain for new information.*

The necessary API keys can be (freely) obtained here:
* [BscScan](https://docs.bscscan.com/getting-started/viewing-api-usage-statistics)/[EtherScan](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics)
* [Covalent API](https://www.covalenthq.com/platform/#/auth/register/)
* [Infura](https://infura.io/) (for Ethereum functionality)

### Compilation and Launch

Run `node dist/index.js` to launch the project. If you'd like to change the source code, you can re-compile using the command `tsc index.ts --outDir dist`.

The program will launch the web server and the app can be accessed at `http://localhost:3003`.

 
