import fetch from 'node-fetch';
import { BaseCurrency } from '../../types/common/main';
import AbiItem from 'web3-utils';

class ScannerApi {
	public rootUrl: string;
	public scannerApiKey: string;
	public baseCurrency: BaseCurrency;

    constructor( rootUrl: string, scannerApiKey: string, baseCurrency: BaseCurrency ) {
        this.rootUrl = rootUrl;
        this.scannerApiKey = scannerApiKey;
        this.baseCurrency = baseCurrency;
    }

    async getLastBlock( timestamp:number ): Promise<number|null> {
        var tsEdit = timestamp;
        var lastBlockUrl = this.rootUrl + 'api?module=block&action=getblocknobytime'
                                        + '&timestamp=' + tsEdit
                                        + '&closest=before'
                                        + '&apikey=' + this.scannerApiKey;
        try{
            var blockReq = await fetch( lastBlockUrl );
            var lastBlock = await blockReq.json();
            if( lastBlock.status === "1" ) return lastBlock.result;
            else return null;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async getPairBaseCurrencyBalance( pairAddress:string ): Promise<bigint|null> {
        var pairBnbUrl = `${this.rootUrl}api?module=account&action=tokenbalance`
                        + `&contractaddress=${this.baseCurrency.address}`
                        + `&address=${pairAddress}`
                        + `&tag=latest`
                        + `&apikey=${this.scannerApiKey}`;
        try {
            var bnbBalanceReq = await fetch( pairBnbUrl );
            var bnbBalance = await bnbBalanceReq.json();
            if( bnbBalance.status === "1" ) return BigInt( bnbBalance.result );
            else return null;
        } catch(e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Attempts to fetch token ABI using
     * token's API interface. Returns
     * null if no ABI is returned
     * for the token. Otherwise the
     * parsed ABI is returned.
     * 
     */
    async getTokenAbi( tokenAddress:string ): Promise<typeof AbiItem|null> {
        try{
            var tokenAbiUrl = `${this.rootUrl}api?module=contract&action=getabi`
                            + `&address=${tokenAddress}`
                            + `&apikey=${this.scannerApiKey}`;
            var tokenAbiReq = await fetch( tokenAbiUrl );
            var tokenAbi = await tokenAbiReq.json();
            if( tokenAbi.result[ 0 ] != 'C' ) {
                var tokenAbiParsed = JSON.parse( tokenAbi.result );
            } else return null;
            return tokenAbiParsed;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getContractSourceCode( tokenAddress:string ): Promise<String|null> {
        try {
            var sourceCodeUrl = `${this.rootUrl}api?`
                                + `module=contract`
                                + `&action=getsourcecode`
                                + `&address=${tokenAddress}`
                                + `&apikey=${this.scannerApiKey}`;
            var sourceCodeReq = await fetch( sourceCodeUrl );
            var sourceCode = await sourceCodeReq.json();
            if( sourceCode.status === "1" ) return sourceCode.result[0].SourceCode;
            else return null;
        } catch(e) {
            console.log(e);
            return null;
        }

    }
}

export default ScannerApi;