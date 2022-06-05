import Web3 = require('web3');
import WebsocketProvider = require('web3-providers-ws');
import colors = require('colors');
// @ts-ignore
import _ = require('lodash');
import type { Base, BaseCurrency, TokenInfo } from '../../types/common/main';
import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import type { Subscription, SubscriptionOptions } from 'web3-core-subscriptions';

var providerOptions = {
    clientConfig: {
        keepalive: true,
        keepaliveInterval: 6000
    },
    reconnect: {
        auto: true,
        delay: 1000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
};

class Web3Controller {
	public web3: any;
	public subscriptions: Map<string, Subscription<SubscriptionOptions>>;
	public transferSubs: Map<string, any>;
	public subCount: number;

    constructor( walletKey: string, provider: string ) {
        //@ts-ignore
        this.web3 = new Web3( new WebsocketProvider( provider, providerOptions ) );
        this.web3.eth.accounts.wallet
            .add( walletKey );
        this.subscriptions = new Map();
        this.transferSubs = new Map();
        this.subCount = 0;
    }

    /**
     * Sets listener for liquidity add event on
     * blockchain for a given `pairAddress`. When
     * listener is triggered, prints relevant 
     * transaction information and destroys
     * listener. 
     * 
     * @param {String} baseCurrencyAddress Address of pair's base currency.
     * @param {String} pairAddress Token pair address.
     * @returns {Promise.<boolean>} `Promise` => `true`/`false`
     * depending on whether listener was successfully set.
     */
    async listenForLiquidityAdd( baseCurrencyAddress: string, pairAddress: string ): Promise<boolean> {
        var subs = this.subscriptions;
        try {
            if( !this.subscriptions.get( pairAddress ) ) {
                var didNotSet;
                var subscription = this.web3.eth.subscribe( 'logs', {
                    address: baseCurrencyAddress,
                    topics: [ '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        null, '0x000000000000000000000000' + pairAddress.slice( 2 ) ]
                }, function( err: any, res: { transactionHash: string; } ) {
                    if( !err ) {
                        console.log( colors.green( "Token liquidity add found!" ) );
                        console.log( "Tx: " + res.transactionHash );
                    }
                    else {
                        console.log( err );
                        didNotSet = true;
                    }
                } ).on( "data", async function() {
                    await subscription.unsubscribe();
                    subs.delete( pairAddress );
                } );
                this.subscriptions.set( pairAddress, subscription );
            }
            if( didNotSet ) return false;
            return true;
        } catch(e) {
            console.log("listenForLiquidityAdd: " + e);
            return false;
        }

    }

    async listenForPairCreated( lastBlock: number, callback: (a: any)=>void ): Promise<boolean> {
        var didNotSet;
        try{
            var subscription:Subscription<SubscriptionOptions> = this.web3.eth.subscribe( 'logs', {

                topics: [ '0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9', null, null ],
                fromBlock: lastBlock
    
            }, function( err: any, res: any ) {
                if( !err ) {
                    console.log( colors.red( "SUBSCRIPTION PAIR CREATED FOUND" ) );
                    callback( res );
                } else {
                    console.log( err );
                    didNotSet = true;
                }
            } );
            if( didNotSet ) return false;
            return true;
        } catch(e) {
            console.log("listenForPairCreated: " + e);
            return false;
        }

    }

    async subscribeToTransferEvents( tokenInterface: any, 
                                     tokenAddress: string, 
                                     pairAddress: string, 
                                     callback: (a: any, b: string, c: string) => void ): Promise<boolean>{
        var didNotSet;
        let options = {
            filter: {
                value: [],
            },
            fromBlock: "pending"
        }
        try{
            var sub:Subscription<SubscriptionOptions> = tokenInterface.events.Transfer( options )
            .on( 'data', (res: { returnValues: any; }) => {
                callback( res, tokenAddress, pairAddress );
            } )
            .on( 'error', (err: string) => { 
                console.log("subscribeToTransferEvents: " + err);
                didNotSet = true;
            } )
            .on( 'connected', (str: string) => {
                // console.log(str);
                
            } )
            this.transferSubs.set( tokenAddress, sub );
            if(didNotSet) return false;
            else return true;  
        } catch(e) {
            console.log("subscribeToTransferEvents: " + e);
            return false;
        }

        
    }

    async getPairBaseCurrencyBalance( pairInterface: any, pairAddress: string, tokenAddress: string, baseCurrency: BaseCurrency ): Promise<Base|null> {
        try {
            let token0 = await pairInterface.methods.token0().call();
            let token1 = await pairInterface.methods.token1().call();
            let reserves = await pairInterface.methods.getReserves().call();
            let base:Base = { 
                amount:0, 
                address:''
            };
            if( _.toLower(token0) == _.toLower(tokenAddress) ){
                base.amount = reserves['_reserve1'];
                base.address = token1;
            } 
            else {
                base.amount = reserves['_reserve0'];
                base.address = token0;
            }
            return base;
        } catch(e) {
            console.log("getPairBaseCurrencyBalance (web3): " + e);
            return null;
        }
    }

    async unsubscribeFrom( subscription: Subscription<SubscriptionOptions> ): Promise<boolean> {
        try {
            await subscription.unsubscribe();
            return true;
        } catch( e ) {
            console.log("unsubscribeFrom: " + e );
            return false;
        }

    }

    getTransferSubByAddress( tokenAddress:string ): Promise<any> {
        return this.transferSubs.get( tokenAddress );
    }

    /**
     * Attempts to fetch token interface using
     * contract ABI.
     */
    async getTokenInterface( tokenAddress: string, tokenAbi: AbiItem ): Promise<Contract|null> {
        if( tokenAbi ) {
            try {
                var tokenInterface = new this.web3.eth.Contract( tokenAbi, tokenAddress);
                return tokenInterface;
            } catch( e ) {
                console.log("getTokenInterface: " + e );
                return null;
            }
        } else return null;
    }

    async getTokenName( tokenInterface: any ): Promise<string|null> {
        if( tokenInterface ) {
            try {
                var name = await tokenInterface.methods.name().call();
                return name;
            } catch( e ) {
                console.log("getTokenName: " + e );
                return null;
            }
        } else return null;
    }

    async getTokenDecimals( tokenInterface: Contract ): Promise<number|null> {
        if( tokenInterface ) {
            try {
                var decimals = await tokenInterface.methods.decimals().call();
                return decimals;
            } catch(e) {
                console.log("getTokenDecimals: " + e);
                return null;
            }
        } else return null;
    }

    async getTokenSymbol( tokenInterface: Contract ): Promise<string|null> {
        if( tokenInterface ) {
            try {
                var symbol = await tokenInterface.methods.symbol().call();
                return symbol;
            } catch(e) {
                console.log("getTokenSymbol: " + e);
                return null
            }
        } else return null;
    }

    async getBlockNumber(): Promise<number|null> {
        try {
            var block = await this.web3.eth.getBlockNumber();
            return block;
        } catch(e) {
            console.log("getBlockNumber: " + e);
            return null;
        }

    }
}

export default Web3Controller;

