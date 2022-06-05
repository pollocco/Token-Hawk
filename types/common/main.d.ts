import Contract from 'web3';

export type BaseCurrency = {
	ticker: string;
	address: string;
	decimals: number;
}

export type Web3Settings = {
	walletAddress: string;
	walletKey: string;
	provider: string;
}

export type Api0xSettings = {
    rootUrl: string, 
    walletAddress: string, 
    baseCurrencyTicker: string, 
    defaultBuyAmount: number, 
    excludedSources: string 
}

export type CovalentApiSettings = {
    chainId: number, 
    apiKey: string
}

export type Slippage = {
    buy: number,
    sell: number
}

export type LockStatus = {
    unlockDate: number,
    lockUrl: string
}

export type ScScams = {
    isCollectable: boolean
}

export type Honeypot = {
    IsHoneypot: boolean,
    Error: string|null,
    MaxTxAmount: number,
    MaxTxAmountBNB: number,
    BuyTax: number,
    SellTax: number,
    BuyGas: number,
    SellGas: number
}

export type TokenInfo = {
    blockDiscovered: string,
    timeDiscovered: number,
    lastUpdated: number,
    tokenName: string,
    tokenAddress: string,
    pairBaseCurrencyBalance: string,
    pairAddress: string,
    holders: number,
    slippage: Slippage,
    tx: string,
    baseCurrencyDecimals: number,
    baseCurrencyName: string,
    scannerRootUrl: string,
    swapRootUrl: string,
    lockStatus: LockStatus,
    isRenounced: boolean,
    renounceTx: string,
    scScams?: ScScams,
    honeypot?: Honeypot
};

export type Token = {
    api: any;
	tokenAddress: string;
	tokenName: string;
	tx: string;
	pairAddress: string;
	pairBaseCurrencyBalance: number;
	tokenInterface: Contract|false;
	honeypot: Honeypot|false;
	scScams: ScScams|false;
	holders: number|false;
	lockStatus: LockStatus|false;
	isRenounced: boolean;
	renounceTx: string|false;
	slippage: Slippage;
}

export type Base = {
    amount: number;
    address: string;
}

export type Api0xPrice = {
    price: string,
    buyAmount: string,
    sellAmount: string,
    gas: string,
    gasPrice: string
}