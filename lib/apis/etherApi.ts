import Api from "./api";
import fetch from 'node-fetch';
import { ethKeys, sharedKeys } from '../../keys.json';
import { BaseCurrency, Web3Settings } from "../../types/common/main";

const baseCurrency:BaseCurrency = {
    ticker: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18
}

const web3Settings:Web3Settings = {
    walletAddress: ethKeys.walletAddress,
    walletKey: ethKeys.walletKey,
    provider: 'wss://mainnet.infura.io/ws/v3/' + ethKeys.infuraProjectId
}

const excluded = 'Native,Uniswap,Eth2Dai,Kyber,Curve,LiquidityProvider,MultiBridge,Balancer,Balancer_V2,CREAM,Bancor,'
+ 'MakerPsm,mStable,Mooniswap,MultiHop,Shell,Swerve,SnowSwap,SushiSwap,DODO,DODO_V2,CryptoCom,Linkswap,KyberDMM,'
+ 'Smoothy,Component,Saddle,xSigma,Curve_V2,Lido,ShibaSwap,Clipper'

const api0xOptions = {
    rootUrl: "https://api.0x.org/", 
    walletAddress: web3Settings.walletAddress, 
    baseCurrencyTicker: baseCurrency.ticker, 
    defaultBuyAmount: 0.00001, 
    excludedSources: excluded
};

const covalentApiOptions = {
    chainId: 56,
    apiKey: sharedKeys.covalentApiKey
};

const pairCreationBlacklist = [
    baseCurrency.address,
    '0x55d398326f99059ff775485246999027b3197955',
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    '0xe9e7cea3dedca5984780bafc599bd69add087d56'
]

class EtherApi extends Api {
	public swapRootUrl: any;
	public scannerRootUrl: any;
	public honeypotNetwork: any;
	public pairCreationBlacklist: any;
	public lockers: any;
	public rootUrl: any;
	public scannerApiKey: any;

    constructor() {
        super(
            'https://api.etherscan.io/',
            baseCurrency,
            web3Settings,
            ethKeys.etherScanApiKey,
            api0xOptions,
            covalentApiOptions
        );
        this.swapRootUrl = "https://app.uniswap.org/#/swap?outputCurrency=";
        this.scannerRootUrl = "https://etherscan.io/";
        this.honeypotNetwork = "eth";
        this.pairCreationBlacklist = pairCreationBlacklist;
        this.lockers = [];
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

export default EtherApi;