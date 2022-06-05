import { TokenInfo } from "../../types/common/main";

import WebServer from "./webServer";
import Token from "./token";
import TokenHistory from "./tokenHistory";
import TradeAnalyzer from "./tradeAnalyzer";

import { sleep, getTimestamp } from "./helpers";
import * as colors from "colors";
import { Mutex } from "async-mutex";
const mutex = new Mutex();
//@ts-ignore
import * as _ from "lodash";
const MIN_PAIR_BASE_CURRENCY = BigInt(500000000000000000n);
const BLOCK_DELAY = 300;

class TokenHawk {
    public api: any;
    public timestamp!: number;
    public lastBlock!: number;
    public tokenHistory!: TokenHistory;
    public server!: WebServer;
    public tokenQueue: Array<Token>;
    public updateQueueMap: Map<string, boolean>;
    public tradeAnalyzer!: TradeAnalyzer;
    public unlockDate!: number;
    public lockUrl!: string;

    constructor(api: any) {
        this.api = api;
        this.timestamp;
        this.lastBlock;
        this.tokenHistory;
        this.server;
        this.tokenQueue = [];
        this.updateQueueMap = new Map();
    }

    logTimeStats(): void {
        console.log("------------");
        // console.log( colors.bold( "Time: " ) + Date( this.timestamp ).toString() );
        console.log(colors.bold("Last block: ") + this.lastBlock);
        console.log("------------");
    }

    /**
     * Fetches last block from scanner API (e.g. BscScan, Etherscan),
     * trying again on failure until block is successfully obtained.
     *
     * @returns {Promise.<Number>} `Promise` => Most recent block as reported
     * by the scanner API.
     */
    async waitForLastBlock(): Promise<number> {
        var lastBlock;
        var hasLastBlock = false;
        while (!hasLastBlock) {
            lastBlock = await this.api.getLastBlock(this.timestamp);
            if (lastBlock) {
                hasLastBlock = true;
            }
        }
        return parseInt(lastBlock);
    }

    /**
     * Checks the amount of base currency
     * in token's dex pair. If
     * base currency is greater than
     * `MIN_PAIR_BASE_CURRENCY`, returns
     * `true`. If base currency is 0 (not
     * yet given liquidity), a listener is
     * added for liquidity add events and
     * function returns `false`. Also returns
     * `false` if base currency exists but
     * is less than `MIN_PAIR_BASE_CURRENCY`.
     *
     * @param {Token} token - `Token` object.
     * @returns {Promise.<boolean>} `Promise` which
     * evaluates to `true`/`false`.
     */
    async evaluatePairLiquidity(token: any): Promise<boolean> {
        if (token.pairBaseCurrencyBalance == 0) {
            await token.api.listenForLiquidityAdd(
                token.api.baseCurrency.address,
                token.pairAddress
            );
        }
        if (token.pairBaseCurrencyBalance >= MIN_PAIR_BASE_CURRENCY) {
            return true;
        } else return false;
    }

    /**
     * Evaluates `Token` object with interface, first
     * by obtaining and evaluating base currency in
     * token's dex pair. If token is sufficiently
     * liquid, checks for known rugpull/scam signs.
     *
     * @param {Token} token `Token` object.
     */
    async evaluateInterfacedToken(token: any): Promise<boolean> {
        var isSufficientlyLiquid = await this.evaluatePairLiquidity(token);
        if (isSufficientlyLiquid) {
            var didInit = await token.initPurchasingProps();
            if (didInit) {
                // var price = await this.api.getLatestPrice( token.tokenAddress, token.slippage.buy );
                var topHolder = await this.api.getTopHolder(token.pairAddress, this.lastBlock);
                console.log("Top holder: " + topHolder);
                var isKnownLocker = await this.isKnownLocker(topHolder, token.pairAddress);
                if (isKnownLocker) {
                    var { unlockDate, lockUrl } = isKnownLocker;
                    token.lockStatus = { unlockDate, lockUrl };
                    console.log(token.lockStatus);
                    // var timeToUnlock = parseInt(unlockDate) - (Math.floor(Date.now()/1000));
                    // console.log("Time diff: " + this.getTimeDiffReadable(timeToUnlock));
                }

                return true;
            } else return false;
            // if( isScam ) console.log( colors.red( "Token flagged as a scam." ) );
        }
        return false;
    }

    getTimeDiffReadable(time: number): Array<number> {
        var dd = Math.floor(time / 60 / 60 / 24);
        time -= dd * 60 * 60 * 24;
        var hh = Math.floor(time / 60 / 60);
        time -= hh * 60 * 60;
        var mm = Math.floor(time / 60);
        time -= mm * 60;
        var ss = time;
        time -= ss;
        return [dd, hh, mm, ss];
    }

    async isKnownLocker(addressToCheck: string, pairAddress: string) {
        if (this.api.lockers) {
            for (let lock in this.api.lockers) {
                if (this.api.lockers[lock].address === addressToCheck) {
                    console.log(
                        colors.green("top holder matched with " + this.api.lockers[lock].name)
                    );
                    return this.api.lockers[lock].getInfo(pairAddress, this.lastBlock - 9999);
                }
            }
        }
        return false;
    }

    async updateWholeToken(oldToken: TokenInfo, newToken: any): Promise<void> {
        var info: TokenInfo = {
            blockDiscovered: oldToken.blockDiscovered,
            timeDiscovered: oldToken.timeDiscovered,
            lastUpdated: getTimestamp(),
            tokenName: newToken.tokenName || "(No name found)",
            tokenAddress: newToken.tokenAddress,
            pairBaseCurrencyBalance: newToken.pairBaseCurrencyBalance.toString(),
            pairAddress: newToken.pairAddress,
            holders: newToken.holders,
            slippage: newToken.slippage,
            tx: newToken.tx,
            baseCurrencyDecimals: this.api.baseCurrency.decimals,
            baseCurrencyName: this.api.baseCurrency.ticker,
            scannerRootUrl: this.api.scannerRootUrl,
            swapRootUrl: this.api.swapRootUrl,
            lockStatus: newToken.lockStatus,
            isRenounced: newToken.isRenounced,
            renounceTx: newToken.renounceTx,
        };
        if (newToken.scScams) info.scScams = newToken.scScams;
        if (newToken.honeypot) info.honeypot = newToken.honeypot;
        this.tokenHistory.addToHistory(oldToken.tokenAddress, info);
        this.server.updateToken(info);
    }

    /*     async updateTokenProp( token, property ) {
            var tok = this.tokenHistory.find( token.tokenAddress );
            if( any[property] == 'bigint' ) tok[property] = token[property].toString();
            else tok[property] = token[property];
            tok.lastUpdated = getTimestamp();
            this.addTokenToHistory( tok );
        } */

    async addTokenToHistory(token: any): Promise<void> {
        var info: TokenInfo = {
            blockDiscovered: this.lastBlock.toString(),
            timeDiscovered: getTimestamp(),
            lastUpdated: getTimestamp(),
            tokenName: token.tokenName || "(No name found)",
            tokenAddress: token.tokenAddress,
            pairBaseCurrencyBalance: token.pairBaseCurrencyBalance.toString(),
            baseCurrencyDecimals: this.api.baseCurrency.decimals,
            baseCurrencyName: this.api.baseCurrency.ticker,
            pairAddress: token.pairAddress,
            slippage: token.slippage,
            holders: token.holders,
            tx: token.tx,
            scannerRootUrl: this.api.scannerRootUrl,
            swapRootUrl: this.api.swapRootUrl,
            lockStatus: token.lockStatus,
            isRenounced: token.isRenounced,
            renounceTx: token.renounceTx,
        };
        if (token.scScams) info.scScams = token.scScams;
        if (token.honeypot) info.honeypot = token.honeypot;
        this.tokenHistory.addToHistory(token.tokenAddress, info);
        this.server.sendTokens();
    }

    async addIndividualToken(token: any): Promise<void> {
        const release = await mutex.acquire();
        try {
            var didInit = await token.initTokenProps();
            if (didInit) {
                if (!this.tokenHistory.find(token.tokenAddress)) {
                    token.printTokenSummary();
                    var didGetProps = await this.evaluateInterfacedToken(token);
                    await this.addTokenToHistory(token);
                    var tokInfoObj = this.tokenHistory.history.get(token.tokenAddress)
                    if (tokInfoObj && didGetProps) {
                        await this.tradeAnalyzer.evaluateToken(
                            tokInfoObj
                        );
                    }
                    console.log("");
                } else {
                    var tok = this.tokenHistory.find(token.tokenAddress);
                    if(tok){
                      await this.evaluateInterfacedToken(token);
                      if (
                          !_.isEqual(tok.pairBaseCurrencyBalance, token.pairBaseCurrencyBalance) ||
                          !_.isEqual(tok.holders, token.holders) ||
                          !_.isEqual(tok.lockStatus, token.lockStatus)
                      )
                          await this.updateWholeToken(tok, token);
                      else if (
                          token.honeypot &&
                          tok.honeypot &&
                          !_.isEqual(tok.honeypot, token.honeypot)
                      )
                          await this.updateWholeToken(tok, token);
                      else if (token.scScams && tok.scScams && !_.isEqual(tok.scScams, token.scScams))
                          await this.updateWholeToken(tok, token);
                    }

                }
                await this.api.subscribeToTransferEvents(
                    token.tokenInterface,
                    token.tokenAddress,
                    token.pairAddress,
                    this.addToUpdateQueueMap
                );
            }
            await sleep(1000);
        } finally {
            release();
        }
    }

    async handleUpdate(key: string, value: TokenInfo): Promise<void> {

            let token = new Token(this.api, value.tokenAddress, value.tx, value.pairAddress);
            console.log("Entered handleUpdate method");
            var tok = this.tokenHistory.find(token.tokenAddress);
            var didInit = await token.initTokenProps();
            if (tok && didInit) {
                var updated = await this.evaluateInterfacedToken(token);
                var tokInfoObj = this.tokenHistory.find(token.tokenAddress);
                if( tokInfoObj ){
                  if (
                    !_.isEqual(tok.pairBaseCurrencyBalance, token.pairBaseCurrencyBalance) ||
                    !_.isEqual(tok.holders, token.holders) ||
                    !_.isEqual(tok.lockStatus, token.lockStatus)
                ) {
                    await this.updateWholeToken(tok, token);
                    if (updated) {
                        await this.tradeAnalyzer.evaluateToken(
                          tokInfoObj
                        );
                    }
                } else if (
                    token.honeypot &&
                    tok.honeypot &&
                    !_.isEqual(tok.honeypot, token.honeypot)
                ) {
                    await this.updateWholeToken(tok, token);
                    if (updated) {
                        await this.tradeAnalyzer.evaluateToken(
                          tokInfoObj
                        );
                    }
                } else if (token.scScams && tok.scScams && !_.isEqual(tok.scScams, token.scScams)) {
                    await this.updateWholeToken(tok, token);
                    if (updated) {
                        await this.tradeAnalyzer.evaluateToken(
                          tokInfoObj
                        );
                    }
                }
                }

            }

    }

    async updateTokens(): Promise<void> {
        const release = await mutex.acquire();
        try {
            console.log("Entered update method");
            if (this.tokenHistory.getSize() === 0) {
                console.log("Nothing in history");
                return;
            } else {
                var history = this.tokenHistory.getHistory();
                history.forEach(async (value: TokenInfo, key: string) => {
                    // should just iterate through updateQueueMap
                    // instead of going through all of history
                    // pointlessly
                    if (this.updateQueueMap.get(key)) {
                        await this.handleUpdate(key, value);
                        await sleep(1200);
                        this.updateQueueMap.delete(key);
                    }
                });
                console.log("Exiting update method.");
            }
        } finally {
            release();
        }
    }

    async processTokenQueue() {
        while (this.tokenQueue.length > 0) {
            var token = this.tokenQueue.shift();
            this.addIndividualToken(token);
        }
    }

    processToken = ((rawTransaction: any): void => {
        if (rawTransaction === null) return;
        var tokenAddress;
        if (
            this.api.pairCreationBlacklist.indexOf("0x" + rawTransaction.topics[1].slice(26)) != -1
        ) {
            tokenAddress = "0x" + rawTransaction.topics[2].slice(26);
        } else {
            tokenAddress = "0x" + rawTransaction.topics[1].slice(26);
        }
        var token = new Token(
            this.api,
            tokenAddress,
            rawTransaction.transactionHash,
            "0x" + rawTransaction.data.slice(26, 66)
        );
        this.tokenQueue.push(token);
    }).bind(this);

    addToUpdateQueueMap = ((
        rawTransaction: any,
        tokenAddress: string,
        pairAddress: string
    ): void => {
        if (_.toLower(rawTransaction.address) == _.toLower(tokenAddress)) {
            if (
                _.toLower(rawTransaction.returnValues.from) == _.toLower(pairAddress) ||
                _.toLower(rawTransaction.returnValues.to) == _.toLower(pairAddress)
            ) {
                console.log(colors.blue("Transfer detected for " + tokenAddress));
                this.updateQueueMap.set(tokenAddress, true);
            }
        }
    }).bind(this);

    /**
     * Main entry point for `TokenHawk` workflow. Establishes
     * `tokenHistory`, `timestamp`, and `lastBlock` properties
     * before entering main loop, which finds and evaluates
     * new tokens as they're added to the blockchain. Sleeps
     * for `timeBetweenIterations` ms between each execution
     * of the main loop.
     *
     * @param {Number} timeBetweenIterations ms between loop
     * iterations.
     * @return {Promise.<void>} `Promise` => none
     */
    async run(timeBetweenIterations: number): Promise<void> {
        this.timestamp = getTimestamp();
        this.lastBlock = await this.api.getBlockWeb3();
        this.tokenHistory = new TokenHistory(BLOCK_DELAY, this.lastBlock);

        this.server = new WebServer(this.tokenHistory.history, 3003);
        await this.server.launch();

        this.tradeAnalyzer = new TradeAnalyzer(BigInt(50000000000000000n), this.api, this.server);

        var t = await this.api.listenForPairCreated(
            this.lastBlock - BLOCK_DELAY,
            this.processToken
        );

        while (true) {
            this.timestamp = getTimestamp();
            this.lastBlock = await this.waitForLastBlock();
            if (this.tokenQueue.length > 0) {
                await this.processTokenQueue();
            }
            if (this.updateQueueMap.size > 0) {
                await this.updateTokens();
            }
            var deleted = this.tokenHistory.clearOldEntries(this.lastBlock);
            for (let item of deleted) {
                var sub = this.api.getTransferSubByAddress(item);
                this.api.unsubscribeFrom(sub);
            }
            await sleep(timeBetweenIterations);
        }
    }
}

export default TokenHawk;
