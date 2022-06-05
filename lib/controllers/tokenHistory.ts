import { TokenInfo } from "../../types/common/main";

class TokenHistory {
	public history: Map<string, TokenInfo>;
	public lookBack: number;
	public startBlock: number;

    constructor( lookBack: number, block: number ) {
        this.history = new Map();
        this.lookBack = lookBack;
        this.startBlock = block;
    }

    getSize(): number {
        return this.history.size;
    }

    getHistory(): any {
        return this.history;
    }

    find( tokenAddress: string ): TokenInfo|null {
        var token = this.history.get( tokenAddress );
        if( token ) return token;
        else return null;
    }

    addToHistory( tokenAddress:string , info:TokenInfo ): void {
        this.history.set( tokenAddress, info );
    }

    deleteFromHistory( tokenAddress:string ): void {
        this.history.delete( tokenAddress );
    }

    clearHistory( block:number ): void {
        this.history = new Map();
        this.startBlock = block;
    }

    /**
     * Clears from history any entries
     * older than `lookBack`.
     * 
     * @param {number} block 
     */
    clearOldEntries( block:number ): Array<string> {
        var deleted = [];
        for( let [k, v] of this.history ){
            if( block - Number(v.blockDiscovered) > this.lookBack ) {
                var blockMinusV = block - Number(v.blockDiscovered);
                var outStr = "Deleting " + k + " with age of " + blockMinusV + " blocks."
                console.log(outStr);
                this.deleteFromHistory( k );
                deleted.push(k);
            }
        }
        return deleted;

    }


}

export default TokenHistory;