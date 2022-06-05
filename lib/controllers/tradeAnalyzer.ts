import {TokenInfo} from '../../types/common/main'

class TradeAnalyzer {
	public maxTrade: bigint;
	public api: any;
	public server: any;
	public balance: bigint;
	public trades: Map<string, any>;

    constructor( maxTrade: bigint, api: any, server: any ) {
        this.maxTrade = maxTrade;
        this.api = api;
        this.server = server;
        this.balance = BigInt(300000000000000000n);
        this.trades = new Map();
    }

    async evaluateToken( token: TokenInfo ): Promise<void> {
        if( this.trades.get( token.tokenAddress ) ) return;
        if( token.lockStatus && ( token.lockStatus.unlockDate - Math.floor( Date.now() / 1000 ) ) > 60 * 60 * 8 ) {
            if( parseInt( token.pairBaseCurrencyBalance ) * Math.pow( 10, -1 * token.baseCurrencyDecimals ) > 0.2 ) {
                if( !token.scScams?.isCollectable && !token.honeypot?.IsHoneypot ) {
                    if( token.slippage.buy < 0.12 && token.slippage.sell < 0.12 ){
                        if( this.balance < this.maxTrade ) {
                            this.server.sendToWebConsole("Wanted to trade " 
                                                        + token.tokenName 
                                                        +  " (" 
                                                        + token.tokenAddress 
                                                        + ") " 
                                                        + "...but I'm broke!"
                            )
                            return;
                        }
                        try{
                            var buyObj = await this.api.getLatestPrice( token.tokenAddress, token.slippage.buy, this.maxTrade.toString() );
                            this.server.sendToWebConsole( "Paper trade: Buying "
                                + buyObj.buyAmount + " "
                                + token.tokenName
                                + " ("
                                + token.tokenAddress
                                + ") "
                                + " for " + (buyObj.sellAmount * Math.pow(10, -1 * token.baseCurrencyDecimals )).toFixed( 5 )
                                + " " + token.baseCurrencyName
                                + '\n' );
                            this.trades.set( token.tokenAddress, buyObj );
                            console.log(this.balance);
                            this.balance -= BigInt(buyObj.sellAmount);
                            this.balance -= BigInt(buyObj.gas * buyObj.gasPrice)
                            console.log(this.balance);
                            setTimeout( () => {
                                this.sellToken( token );
                            }, 60000*5 );
                        } catch(e) {
                            console.log("evaluateToken: " + e);
                        }
                    }


                }
            }
        }
    }

    async sellToken( token: TokenInfo ): Promise<void> {
        var buyObj = this.trades.get( token.tokenAddress );
        var sellObj = await this.api.getLatestSellPrice( token.tokenAddress, token.slippage.sell, buyObj.buyAmount );
        this.server.sendToWebConsole( "Paper trade: Sold "
                                        + parseInt(sellObj.sellAmount).toFixed(5) + " "
                                        + token.tokenName + " for "
                                        + (parseInt(sellObj.buyAmount) * Math.pow(10, -1 * token.baseCurrencyDecimals )).toFixed( 5 )
                                        + " " +  token.baseCurrencyName
                                        + '\n'
                                    )
        this.balance += BigInt(sellObj.buyAmount);
        this.balance -= BigInt(sellObj.gas * sellObj.gasPrice);
        var bal = Number(this.balance) * (Math.pow(10, -1 * token.baseCurrencyDecimals ));
        this.server.sendToWebConsole("Balance: " + bal);
    }


}

export default TradeAnalyzer;