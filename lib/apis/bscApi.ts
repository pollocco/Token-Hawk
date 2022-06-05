import Api from "./api";
import fetch from 'node-fetch';
import { BaseCurrency, Web3Settings } from '../../types/common/main';
import { bscKeys, sharedKeys } from '../../../keys.json';
import { getTimestamp } from '../controllers/helpers';
import { sleep } from "../controllers/helpers";

const baseCurrency:BaseCurrency = {
    ticker:"WBNB",
    address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    decimals: 18
}

const web3Settings:Web3Settings = {
    walletAddress: bscKeys.walletAddress,
    walletKey: bscKeys.walletKey,
    provider: 'wss://speedy-nodes-nyc.moralis.io/ea5a4a202b77694cb5684782/bsc/mainnet/ws'
    // 'wss://bsc-ws-node.nariox.org:443'
}

const excluded = 'BakerySwap,Belt,DODO,DODO_V2,Ellipsis,Mooniswap,MultiHop,Nerve,SushiSwap,'
    + 'Smoothy,ApeSwap,CafeSwap,CheeseSwap,JulSwap,LiquidityProvider,PancakeSwap';

const api0xOptions = {
    rootUrl: "https://bsc.api.0x.org/",
    walletAddress: web3Settings.walletAddress,
    baseCurrencyTicker: baseCurrency.ticker,
    defaultBuyAmount: 100000000000000,
    excludedSources: excluded
};

const covalentApiOptions = {
    chainId: 56,
    apiKey: sharedKeys.covalentApiKey
};

const badEndpointpairs = [
    '0x55d398326f99059ff775485246999027b3197955'
];

const bscLiquidityLockers = {
    mudra: {
        "name": "mudra",
        "address": '0xae7e6cabad8d80f0b4e1c4dde2a5db7201ef1252',
        "lockerRootUrl": "https://mudra.website/?certificate=yes&type=0&lp=",
        "interface": ""
    },
    pinkLock: {
        "name": "pinkLock",
        "address": '0x7ee058420e5937496f5a2096f04caa7721cf70cc',
        "lockerRootUrl": "https://www.pinksale.finance/#/pinklock/detail/",
        "interface": ""
    }
};

const pairCreationBlacklist = [
    baseCurrency.address,
    '0x55d398326f99059ff775485246999027b3197955',
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    '0xe9e7cea3dedca5984780bafc599bd69add087d56'
];

class BscApi extends Api {
	public swapRootUrl: string;
	public scannerRootUrl: string;
	public honeypotNetwork: string;
	public pairCreationBlacklist: Array<string>;
	public lockers: any;
	public rootUrl!: string;
	public scannerApiKey!: string;

    constructor() {
        super(
            'https://api.bscscan.com/',
            baseCurrency,
            web3Settings,
            bscKeys.bscScanApiKey,
            api0xOptions,
            covalentApiOptions
        );
        this.swapRootUrl = "https://pancakeswap.finance/swap?outputCurrency=";
        this.scannerRootUrl = "https://bscscan.com/";
        this.honeypotNetwork = "bsc2";
        this.pairCreationBlacklist = pairCreationBlacklist;
        this.lockers = bscLiquidityLockers;
        this.lockers.pinkLock.getInfo = ( pairAddress: any ) => { return this.getPinkLockInfo( pairAddress ); };
        this.lockers.mudra.getInfo = async ( pairAddress: any, lastBlock: any ) => {
            return this.getMudraLogs( pairAddress, lastBlock );
        };
    }

    async getPinkLockInterface(): Promise<any|null> {
        var pinkLockImplementationContract = '0xb9abf98cab2c8bd2adf8282e52bf659adb0260fe'; // different from locker contract
        try{
            var abi = await super.getTokenAbi( pinkLockImplementationContract );
            if( abi ){
                var tokenInterface = await super.getTokenInterface( this.lockers.pinkLock.address, abi );
                return tokenInterface;
            }

        } catch(e) {
            console.log("getPinkLockInterface: " + e);
            return null;
        }
    }

    async getPinkLockInfo( pairAddress: string ) {
        if( !this.lockers.pinkLock.interface ) {
            this.lockers.pinkLock.interface = await this.getPinkLockInterface();
        }
        try { 
            var lockInfo = await this.lockers.pinkLock.interface.methods.getLocksForToken( pairAddress, 0, 0 ).call();
            return {
                unlockDate: lockInfo[ 0 ].unlockDate,
                lockUrl: this.lockers.pinkLock.lockerRootUrl + pairAddress
            };
         } catch(e) {
             console.log("getPinkLockInfo: " + e);
             return null;
         }

    }

    async getMudraLogs( pairAddress: string, fromBlock: number ) {
        try {
            var addLiqEventUrl = `${this.rootUrl}api?module=logs&action=getLogs`
                + `&topic0=0x601e52fd7ec7840490f1ae9c376bc3b32f6a6a6aac8dc10db76d87ef0fa45d32`
                + `&topic3=0x000000000000000000000000${pairAddress.slice( 2 )}`
                + `&fromBlock=${fromBlock}`
                + `&apikey=${this.scannerApiKey}`;
            var addLiqEventReq = await fetch( addLiqEventUrl );
            var addLiqEvent = await addLiqEventReq.json();
            if( addLiqEvent.result.length == 0 ) {
                sleep( 1000 );
                var addLiqEventUrl2 = `${this.rootUrl}api?module=logs&action=getLogs`
                    + `&topic0=0x601e52fd7ec7840490f1ae9c376bc3b32f6a6a6aac8dc10db76d87ef0fa45d32`
                    + `&topic2=0x000000000000000000000000${pairAddress.slice( 2 )}`
                    + `&fromBlock=${fromBlock}`
                    + `&apikey=` + this.scannerApiKey;
                var addLiqEventReq2 = await fetch( addLiqEventUrl2 );
                var addLiqEvent2 = await addLiqEventReq2.json();
                if( addLiqEvent2.result.length == 0 ) return null;

                else return { unlockDate: parseInt( addLiqEvent2.result[ 0 ].data.slice( 120 ), 16 ), lockUrl: this.lockers.mudra.lockerRootUrl + pairAddress };
            } else return {
                unlockDate: parseInt( addLiqEvent.result[ 0 ].data.slice( 120 ), 16 ),
                lockUrl: this.lockers.mudra.lockerRootUrl + pairAddress
            }; // to hex
        } catch( e ) {
            console.log( e );
            return null;
        }
    }

    async getRecentPairCreations( fromBlock: number ) {
        try {
            var addLiqEventUrl = `${this.rootUrl}api?module=logs&action=getLogs&fromBlock=${fromBlock}`
                + `&topic0=0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9`
                + `&apikey=` + this.scannerApiKey;
            var addLiqEventReq = await fetch( addLiqEventUrl );
            var addLiqEvent = await addLiqEventReq.json();
            if( !addLiqEvent?.result?.length ) {
                return null;
            } else {
                return addLiqEvent.result;
            }
        } catch( e ) {
            console.log( e );
            return null;
        }
    };
}

export default BscApi;