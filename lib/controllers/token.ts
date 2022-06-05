import fetch from 'node-fetch';
import ContractUtils from './contractUtils';
import * as colors from 'colors';
import Contract from 'web3'
import { Honeypot, LockStatus, ScScams, Slippage } from '../../types/common/main';

class Token {
	public api: any;
	public tokenAddress: string;
	public tokenName!: string;
	public tx: string;
	public pairAddress: string;
	public pairBaseCurrencyBalance?: bigint|null;
	public tokenInterface?: Contract;
	public honeypot?: Honeypot|null;
	public scScams?: ScScams|null;
	public holders?: number;
	public lockStatus?: LockStatus;
	public isRenounced?: boolean;
	public renounceTx?: string;
	public slippage?: Slippage;

    constructor( api: any, tokenAddress: string, tx: string, pairAddress: string ) {
        this.api = api;
        this.tokenAddress = tokenAddress;
        this.tokenName;
        this.tx = tx;
        this.pairAddress = pairAddress;
        this.pairBaseCurrencyBalance;
        this.tokenInterface;
        this.honeypot;
        this.scScams;
        this.holders;
        this.lockStatus;
        this.isRenounced;
        this.renounceTx;
    }

    async getContractScamsObject(): Promise<ScScams|null> {
        let sourceCode = await this.api.getContractSourceCode( this.tokenAddress );
        if( sourceCode ) {
            let isCollectable = ContractUtils.isCollectable( sourceCode );
            this.scScams = {
                "isCollectable": isCollectable
            };
            return this.scScams;
        }
        else return null;

    }

    /**
     * Uses honeypot.is API to perform a honeypot check (a 
     * 'honeypot' is a token which cannot be sold), and returning
     * the results of the scan if successful, or null if the
     * request failed (or `honeypotNetwork` property is not set
     * on the given `API` instance).
     * 
     * @param {boolean} printResults Whether to print results of
     * honeypot check to `stdout`. 
     * @returns {Promise.<Object|boolean>} `Promise` =>  
     * depending on whether request was successful.
     */
    async getHoneypotCheck( printResults: boolean ): Promise<Honeypot | null> {
        function logHoneypot( honeypot: Honeypot ) {
            console.log( honeypot );
        }
        if( this.api.honeypotNetwork ) {
            
            const honeypotUrl = 'https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot'
                + '?chain=' + this.api.honeypotNetwork
                + '&token=' + this.tokenAddress;
            try {
                var honeypotReq = await fetch( honeypotUrl );
                var honeypot = await honeypotReq.json();
                if( printResults ) {
                    logHoneypot( honeypot );
                }
                return honeypot;
            } catch( e ) {
                console.log( e );
                return null;
            }
        } else return null;
    }

    async getSlippageObject( buyTax: number, sellTax: number ): Promise<Slippage> {
        var slippage = {
            buy: buyTax / 100 + 0.03,
            sell: sellTax / 100 + 0.03
        };
        return slippage;
    }

    /**
     * Prints token name, base currency liquidity of
     * token pair, and address.
     * 
     * @returns {Promise.<boolean>} `Promise` => `true`/`null` depending on
     * whether report was successfully printed to
     * `stdout`.
     */
    async printTokenSummary(): Promise<boolean> {
        if( this.tokenInterface ) {
            let name;
            if( !this.tokenName ) name = "(No name)";
            else name = this.tokenName;
            let baseCurrencyMultiplier = Math.pow( 10, ( this.api.baseCurrency.decimals * -1 ) );
            let baseCurrencyReadable = Number( this.pairBaseCurrencyBalance ) * baseCurrencyMultiplier;
            console.log( colors.yellow( "Name: " ) + name );
            console.log( colors.yellow( this.api.baseCurrency.ticker + " in liq: " ) + baseCurrencyReadable );
            console.log( colors.yellow( "Token address: " ) + this.tokenAddress );
            return true;
        } else return false;
    }

    /**
     * Attempts to fetch token interface. If
     * successful, sets the tokens interface
     * property, then sets `pairBaseCurrency`
     * prop on token and returns `true`. Otherwise
     * `false`. 
     * 
     * @returns {Promise.<boolean>} `Promise` => `true`/`false` depending
     * on whether `tokenInterface`/`pairBaseCurrency` was set on
     * `Token` object.
     */
    async initTokenProps(): Promise<boolean> {
        try {
            var tokenAbi = await this.api.getTokenAbi( this.tokenAddress );
            if( !tokenAbi ) return false;
            var tokenInterface = await this.api.getTokenInterface( this.tokenAddress, tokenAbi );
            if( !tokenInterface ) return false;
            else {
                this.tokenInterface = tokenInterface;
                this.pairBaseCurrencyBalance = await this.api.getPairBaseCurrencyBalance( this.pairAddress );
                this.tokenName = await this.api.getTokenName( this.tokenInterface );
                var lastBlock = await this.api.getBlockWeb3();
                this.holders = await this.api.getHolders( this.tokenAddress, lastBlock );
                let allTransactions = await this.api.getTransactionsForAddress( this.tokenAddress );
                let renounceTx = this.getRenounced( allTransactions )
                if( renounceTx ) {
                    this.isRenounced = true;
                    this.renounceTx = renounceTx;
                }
                if( this.tokenName && this.holders && this.pairBaseCurrencyBalance != null ) return true;
                else return false;
            } 
        } catch( e ) {
            console.log( e );
            return false;
        }
    }

    getRenounced( transactions: any ) {
        if( transactions === null ) return;
        for( let t of transactions ) {
            for( let l of t["log_events"] ) {
                if( l["decoded"] && l["decoded"]["name"] && l["decoded"]["name"] == "OwnershipTransferred" ) {
                    for( let param of l["decoded"]["params"] ){
                        if( param["name"] == "newOwner" && param["value"] == "0x0000000000000000000000000000000000000000" ){
                            return t["tx_hash"];
                        }
                    }
                }
            }
        }
        return null;
    }

    async initPurchasingProps() {
        this.honeypot = await this.getHoneypotCheck( false );
        if( this.honeypot ) {
            this.scScams = await this.getContractScamsObject();
            this.slippage = await this.getSlippageObject( this.honeypot.BuyTax, this.honeypot.SellTax );
            if( this.scScams && this.slippage ) return true;
        } else return false;
    }

}

export default Token;