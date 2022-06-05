import { Api0xSettings, BaseCurrency, CovalentApiSettings, Slippage, Web3Settings } from "../../types/common/main";
import Web3Controller from '../controllers/web3Controller';
import Api0x from './api0x';
import CovalentApi from './covalentApi';
import ScannerApi from './scannerApi';
import AbiItem from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import type { Subscription, SubscriptionOptions } from 'web3-core-subscriptions';

class Api {
	public rootUrl: string;
	public baseCurrency: BaseCurrency;
	public scannerApiKey: string;
	public web3: any;
	public api0x: Api0x;
	public covalentApi: CovalentApi;
	public scannerApi: ScannerApi;

    constructor( rootUrl: string, 
                 baseCurrency: BaseCurrency, 
                 web3Settings: Web3Settings, 
                 scannerApiKey: string, 
                 api0xSettings: Api0xSettings, 
                 covalentApiSettings: CovalentApiSettings ) {
        this.rootUrl = rootUrl;
        this.baseCurrency = baseCurrency;
        this.scannerApiKey = scannerApiKey;
        this.web3 = new Web3Controller( web3Settings.walletKey, web3Settings.provider );
        this.api0x = new Api0x( ...(Object.values( api0xSettings ) as [string, string, string, number, string]));
        this.covalentApi = new CovalentApi( ...Object.values( covalentApiSettings ) as [number, string]);
        this.scannerApi = new ScannerApi( rootUrl,  scannerApiKey, baseCurrency );

    }

    async getLastBlock( timestamp: number ) {
        var block = await this.scannerApi.getLastBlock( timestamp );
        return block;
    }

    async getPairBaseCurrencyBalance( pairAddress: string ) {
        var bcBalance = await this.scannerApi.getPairBaseCurrencyBalance( pairAddress );
        return bcBalance;
    }

    async getTokenAbi( tokenAddress: string ) {
        var abi = await this.scannerApi.getTokenAbi( tokenAddress );
        return abi;
    }

    async getContractSourceCode( tokenAddress: string ){
        var sourceCode = await this.scannerApi.getContractSourceCode( tokenAddress );
        return sourceCode;
    }

    async getLatestPrice( tokenAddress: string, slippage: Slippage, buyAmount: number ) {
        var latest = await this.api0x.getLatestPrice( tokenAddress, slippage, buyAmount );
        return latest;
    }

    async getLatestSellPrice( tokenAddress: string, slippage: Slippage, sellAmount: number ) {
        var sell = await this.api0x.getLatestSellPrice( tokenAddress, slippage, sellAmount );
        return sell;
    }

    async getHolders( tokenAddress: string, lastBlock: string ) {
        var holders = await this.covalentApi.getHolders( tokenAddress, lastBlock );
        return holders;
    }

    async getTopHolder( tokenAddress: string, lastBlock: string ) {
        var topHolder = await this.covalentApi.getTopHolder( tokenAddress, lastBlock );
        return topHolder;
    }

    async getTransactionsForAddress( tokenAddress: string ) {
        var transactions = await this.covalentApi.getTransactionsForAddress( tokenAddress );
        return transactions;
    }

    async listenForLiquidityAdd( baseCurrencyAddress: string, pairAddress: string ) {
        var didSet = await this.web3.listenForLiquidityAdd( baseCurrencyAddress, pairAddress );
        return didSet;
    }

    async listenForPairCreated( lastBlock: number, callback: any ) {
        var didSet = await this.web3.listenForPairCreated( lastBlock, callback );
        return didSet;
    }

    async subscribeToTransferEvents( tokenInterface: Contract, 
        tokenAddress: string, 
        pairAddress: string, 
        callback: any ): Promise<boolean> {
        var didSet = await this.web3.subscribeToTransferEvents( tokenInterface, tokenAddress, pairAddress, callback );
        return didSet;
    }

    async subscribeToTransfers( tokenAddress: string, pairAddress: string, callback: any ) {
        var didSet = await this.web3.subscribeToTransfers( tokenAddress, pairAddress, callback );
        return didSet;
    }

    async unsubscribeFrom( subscription: Subscription<SubscriptionOptions> ) {
        var unsub = await this.web3.unsubscribeFrom( subscription );
        return unsub;
    }

    getTransferSubByAddress( tokenAddress: string ){
        var sub = this.web3.getTransferSubByAddress( tokenAddress );
        return sub;
    }

    async getTokenInterface( tokenAddress: string, tokenAbi: typeof AbiItem ) {
        var tokenInterface = await this.web3.getTokenInterface( tokenAddress, tokenAbi );
        return tokenInterface;
    }

    async getPairBaseCurrencyBalanceWeb3( pairInterface: Contract, pairAddress: string, tokenAddress: string ) {
        var balance = await this.web3.getPairBaseCurrencyBalance( pairInterface, pairAddress, tokenAddress );
        return balance;
    }

    async getTokenName( tokenInterface: Contract ) {
        var tokenName = await this.web3.getTokenName( tokenInterface );
        return tokenName;
    }

    async getTokenDecimals( tokenInterface: Contract ) {
        var decimals = await this.web3.getTokenDecimals( tokenInterface );
        return decimals;
    }

    async getTokenSymbol( tokenInterface: Contract ) {
        var symbol = await this.web3.getTokenSymbol( tokenInterface );
        return symbol;
    }

    async getBlockWeb3(){
        var block = await this.web3.getBlockNumber();
        return block;
    }

}

export default Api;