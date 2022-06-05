import fetch from 'node-fetch';
import * as qs from 'qs';
import {Api0xPrice, Slippage} from '../../types/common/main'

class Api0x {
	public rootUrl: string;
	public walletAddress: string;
	public baseCurrencyTicker: string;
	public defaultBuyAmount: number;
	public excludedSources: string;

    constructor( rootUrl: string, walletAddress: string, baseCurrencyTicker: string, defaultBuyAmount: number, excludedSources: string ) {
        this.rootUrl = rootUrl;
        this.walletAddress = walletAddress;
        this.baseCurrencyTicker = baseCurrencyTicker;
        this.defaultBuyAmount = defaultBuyAmount;
        this.excludedSources = excludedSources;
    }

    async getLatestPrice( tokenAddress: string, slippage: Slippage, sellAmount: number ): Promise<Api0xPrice|null> {
        const params = {
            buyToken: tokenAddress,
            sellToken: this.baseCurrencyTicker,
            sellAmount: sellAmount,
            slippagePercentage: slippage,
            excludedSources: this.excludedSources
        };
        try {
            const url = this.rootUrl + 'swap/v1/' + 'quote?' + qs.stringify( params ) // + '&takerAddress=' + this.walletAddress
            const response = await fetch( url );
            var data = await response.json();
            if( data?.code ) {
                console.log(data);
                return null;
            } else return {
                price: data.guaranteedPrice,
                buyAmount: data.buyAmount,
                sellAmount: data.sellAmount,
                gas: data.estimatedGas,
                gasPrice: data.gasPrice
            };
        } catch( e ) {
            console.log( e );
            return null;
        }
    }

    async getLatestSellPrice( tokenAddress: string, slippage: Slippage, sellAmount: number ): Promise<Api0xPrice|null> {
        const params = {
            sellToken: tokenAddress,
            buyToken: this.baseCurrencyTicker,
            sellAmount: sellAmount,
            slippagePercentage: slippage,
            excludedSources: this.excludedSources
        };
        try {
            const url = this.rootUrl + 'swap/v1/' + 'quote?' + qs.stringify( params ) // + '&takerAddress=' + this.walletAddress
            console.log(url);
            const response = await fetch( url );
            var data = await response.json();
            if( data?.code ) {
                console.log(data);
                return null;
            } else return {
                price: data.guaranteedPrice,
                buyAmount: data.buyAmount,
                sellAmount: data.sellAmount,
                gas: data.estimatedGas,
                gasPrice: data.gasPrice
            } ;
        } catch( e ) {
            console.log( e );
            return null;
        }
    }
}

export default Api0x;