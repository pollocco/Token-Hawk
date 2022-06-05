import fetch from 'node-fetch';

class CovalentApi {
	public chainId: number;
	public apiKey: string;

    constructor( chainId: number, apiKey: string ) {
        this.chainId = chainId;
        this.apiKey = apiKey;
    }

    async getHolders( tokenAddress: string, lastBlock: string ): Promise<number|null> {
        var holdersUrl = 'https://api.covalenthq.com/v1/' + this.chainId
                         + '/tokens/' + tokenAddress
                         + '/token_holders/?quote-currency=USD&format=JSON'
                         + '&page-size=999999999'
                         + '&block-height=' + lastBlock
                         + '&key=' + this.apiKey;
        try {
            var holdersReq = await fetch( holdersUrl );
            var holders = await holdersReq.json();
            return holders.data.items.length;
         } catch(e) {
             console.log(e);
             return null;
         }
    }

    async getTopHolder( tokenAddress: string, lastBlock: string ): Promise<String|null> {
        var holdersUrl = 'https://api.covalenthq.com/v1/' + this.chainId
                         + '/tokens/' + tokenAddress
                         + '/token_holders/?quote-currency=USD&format=JSON'
                         + '&block-height=' + lastBlock
                         + '&key=' + this.apiKey;
        try {
            var holdersReq = await fetch( holdersUrl );
            var holders = await holdersReq.json();
            if( holders.data.items.length != 0 ) {
                return holders.data.items[0].address;
            } else {
                return null;
            }
        } catch(e) {
            console.log(e);
            return null;
        }
    }

    async getTransactionsForAddress( tokenAddress: string ): Promise<Array<any>|null> {
        var transAddress = 'https://api.covalenthq.com/v1/56'
                         + '/address/' + tokenAddress
                         + '/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false'
                         + '&key=' + this.apiKey;
        try {
            var transReq = await fetch( transAddress );
            var transactions = await transReq.json();
            if( transactions.data.items.length != 0 ) {
                return transactions.data.items;
            } else {
                console.log(transactions.data);
                return null;
            }
        } catch(e) {
            console.log(e);
            return null;
        }
    }
}

export default CovalentApi;