"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionParser = void 0;
var token_parser_1 = require("./token-parser");
var token_utils_1 = require("../lib/token-utils");
var format_numbers_1 = require("../lib/format-numbers");
var solana_1 = require("../providers/solana");
var logger_1 = require("../utils/logger");
var trade_config_1 = require("../lib/config/trade-config");
var multi_buy_tracker_1 = require("../lib/multi-buy-tracker");
var multi_sell_tracker_1 = require("../lib/multi-sell-tracker");
var TransactionParser = /** @class */ (function () {
    function TransactionParser(transactionSignature) {
        this.transactionSignature = transactionSignature;
        this.multiBuyTracker = multi_buy_tracker_1.MultiBuyTracker.getInstance();
        this.multiSellTracker = multi_sell_tracker_1.MultiSellTracker.getInstance();
        this.connection = solana_1.RpcConnectionManager.logConnection;
        this.tokenUtils = new token_utils_1.TokenUtils(this.connection);
        this.transactionSignature = this.transactionSignature;
        this.tokenParser = new token_parser_1.TokenParser(this.connection);
    }
    TransactionParser.prototype.isSignificantBuy = function (solAmount, solPriceUsd, marketCap) {
        if (!marketCap || marketCap === 0)
            return false;
        var usdAmount = solAmount * solPriceUsd;
        // Check if meets minimum SOL amount
        if (solAmount < trade_config_1.TRADE_CONFIG.MIN_SOL_AMOUNT)
            return false;
        // Calculate ratio of buy amount to market cap
        var buyRatio = usdAmount / marketCap;
        return buyRatio >= trade_config_1.TRADE_CONFIG.SIGNIFICANT_BUY_RATIO;
    };
    TransactionParser.prototype.isWhaleActivity = function (solAmount) {
        // Check if meets minimum SOL amount
        if (solAmount < trade_config_1.TRADE_CONFIG.WHALE_ACTIVITY.MIN_SOL_AMOUNT)
            return false;
        return true;
    };
    TransactionParser.prototype.parseRpc = function (transactionDetails, swap, solPriceUsd) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, amountIn, tokenIn, amountOut, tokenOut, currentHoldingPrice, currenHoldingPercentage, isNew, transactions_1, parsedInfos_1, tokenInMint, tokenOutMint, accountKeys, signerAccount, signerAccountAddress, preBalances, postBalances, nativeBalance, totalSolSwapped, i, preBalance, postBalance, solDifference, raydiumTransfer, tokenOutInfo, tokenInInfo, amountOutValue, formattedAmountOut, formattedAmountIn, tokenMc, raydiumTokenPrice, swapDescription, tokenPrice, tokenToMc, _a, tokenMarketCap, supplyAmount, tokenHoldings, isLargeBuy, solAmount, isMultiBuy, solAmount, isMultiSell, solAmount, isWhaleActivity, tokenOutInfo, tokenInInfo, formattedAmount, swapDescription, tokenMc, tokenToMc, tokenPrice, _b, tokenMarketCap, supplyAmount, tokenHoldings, isLargeBuy, solAmount, isMultiBuy, solAmount, isMultiSell, solAmount, isWhaleActivity, error_1;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
            return __generator(this, function (_11) {
                switch (_11.label) {
                    case 0:
                        _11.trys.push([0, 23, , 24]);
                        if (transactionDetails === undefined) {
                            logger_1.Logger.error('Transaction not found or invalid.');
                            return [2 /*return*/];
                        }
                        owner = '';
                        amountIn = '';
                        tokenIn = '';
                        amountOut = '';
                        tokenOut = '';
                        currentHoldingPrice = '';
                        currenHoldingPercentage = '';
                        isNew = false;
                        transactions_1 = [];
                        parsedInfos_1 = [];
                        tokenInMint = '';
                        tokenOutMint = '';
                        accountKeys = (_c = transactionDetails[0]) === null || _c === void 0 ? void 0 : _c.transaction.message.accountKeys;
                        if (!accountKeys) {
                            logger_1.Logger.error('Account keys not found in transaction details.', transactionDetails);
                            return [2 /*return*/];
                        }
                        signerAccount = accountKeys.find(function (account) { return account.signer === true; });
                        signerAccountAddress = signerAccount === null || signerAccount === void 0 ? void 0 : signerAccount.pubkey.toString();
                        preBalances = (_e = (_d = transactionDetails[0]) === null || _d === void 0 ? void 0 : _d.meta) === null || _e === void 0 ? void 0 : _e.preBalances;
                        postBalances = (_g = (_f = transactionDetails[0]) === null || _f === void 0 ? void 0 : _f.meta) === null || _g === void 0 ? void 0 : _g.postBalances;
                        // Transaction Metadata
                        (_k = (_j = (_h = transactionDetails[0]) === null || _h === void 0 ? void 0 : _h.meta) === null || _j === void 0 ? void 0 : _j.innerInstructions) === null || _k === void 0 ? void 0 : _k.forEach(function (i) {
                            // raydium
                            i.instructions.forEach(function (r) {
                                var _a;
                                if (((_a = r.parsed) === null || _a === void 0 ? void 0 : _a.type) === 'transfer' && r.parsed.info.amount !== undefined) {
                                    transactions_1.push(r.parsed);
                                }
                            });
                        });
                        // pumpfun
                        (_l = transactionDetails[0]) === null || _l === void 0 ? void 0 : _l.transaction.message.instructions.map(function (instruction) {
                            if (transactions_1.length <= 1 && instruction && instruction.parsed !== undefined) {
                                parsedInfos_1.push(instruction.parsed);
                            }
                        });
                        nativeBalance = this.tokenUtils.calculateNativeBalanceChanges(transactionDetails, Number(solPriceUsd));
                        if (!(nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type)) {
                            return [2 /*return*/];
                        }
                        if (!preBalances || !postBalances) {
                            logger_1.Logger.error('No balance information available');
                            return [2 /*return*/];
                        }
                        totalSolSwapped = 0;
                        for (i = 0; i < preBalances.length; i++) {
                            preBalance = preBalances[i];
                            postBalance = postBalances[i];
                            solDifference = (postBalance - preBalance) / 1e9 // Convert lamports to SOL
                            ;
                            if (solDifference < 0 && i === 1 && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell') {
                                totalSolSwapped += Math.abs(solDifference);
                            }
                            else if (solDifference < 0 && i === 2 && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell') {
                                totalSolSwapped += Math.abs(solDifference);
                            }
                            else if (solDifference < 0 && i === 5 && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell') {
                                totalSolSwapped += Math.abs(solDifference);
                            }
                            else if (solDifference !== 0 && i === 3 && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'buy') {
                                totalSolSwapped += Math.abs(solDifference);
                                // In case index 3 doesnt hold the amount
                            }
                            else if (solDifference === 0 && i === 3 && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'buy') {
                                totalSolSwapped = Math.abs((postBalances[2] - preBalances[2]) / 1e9);
                            }
                        }
                        raydiumTransfer = transactions_1.length > 2
                            ? transactions_1.find(function (t) { var _a, _b, _c; return ((_a = t === null || t === void 0 ? void 0 : t.info) === null || _a === void 0 ? void 0 : _a.destination) === ((_c = (_b = transactions_1[0]) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.source); })
                            : transactions_1[transactions_1.length - 1];
                        if (!raydiumTransfer) {
                            logger_1.Logger.error('NO RAYDIUM TRANSFER');
                            return [2 /*return*/];
                        }
                        if (!(transactions_1.length > 1)) return [3 /*break*/, 11];
                        if (!((nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.tokenUtils.getTokenMintAddress((_m = transactions_1[0]) === null || _m === void 0 ? void 0 : _m.info.destination)];
                    case 1:
                        tokenOutMint = (_o = (_11.sent())) !== null && _o !== void 0 ? _o : '';
                        tokenInMint = 'So11111111111111111111111111111111111111112';
                        if (tokenOutMint === null) {
                            logger_1.Logger.error('NO TOKEN OUT MINT');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.tokenParser.getTokenInfo(tokenOutMint)];
                    case 2:
                        tokenOutInfo = _11.sent();
                        tokenOut = tokenOutInfo.data.symbol.replace(/\x00/g, '');
                        tokenIn = 'SOL';
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.tokenUtils.getTokenMintAddress(raydiumTransfer.info.source)];
                    case 4:
                        tokenInMint = (_p = (_11.sent())) !== null && _p !== void 0 ? _p : '';
                        tokenOutMint = 'So11111111111111111111111111111111111111112';
                        if (tokenInMint === null) {
                            logger_1.Logger.error('NO TOKEN IN MINT');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.tokenParser.getTokenInfo(tokenInMint)];
                    case 5:
                        tokenInInfo = _11.sent();
                        tokenIn = tokenInInfo.data.symbol.replace(/\x00/g, '');
                        tokenOut = 'SOL';
                        _11.label = 6;
                    case 6:
                        amountOutValue = Number((_r = (_q = transactions_1[0]) === null || _q === void 0 ? void 0 : _q.info) === null || _r === void 0 ? void 0 : _r.amount);
                        formattedAmountOut = format_numbers_1.FormatNumbers.formatTokenAmount(amountOutValue);
                        formattedAmountIn = format_numbers_1.FormatNumbers.formatTokenAmount(Number((_s = raydiumTransfer === null || raydiumTransfer === void 0 ? void 0 : raydiumTransfer.info) === null || _s === void 0 ? void 0 : _s.amount));
                        // owner = parsedInfos[0]?.info?.source ? parsedInfos[0]?.info?.source : transactions[0]?.info?.authority
                        owner = signerAccountAddress ? signerAccountAddress : (_u = (_t = transactions_1[0]) === null || _t === void 0 ? void 0 : _t.info) === null || _u === void 0 ? void 0 : _u.authority;
                        amountOut =
                            tokenOut === 'SOL' ? (Number((_w = (_v = transactions_1[0]) === null || _v === void 0 ? void 0 : _v.info) === null || _w === void 0 ? void 0 : _w.amount) / 1e9).toFixed(4).toString() : formattedAmountOut;
                        amountIn =
                            tokenIn === 'SOL' ? (Number(raydiumTransfer.info.amount) / 1e9).toFixed(4).toString() : formattedAmountIn;
                        tokenMc = null;
                        raydiumTokenPrice = null;
                        swapDescription = "".concat(owner, " swapped ").concat(amountOut, " ").concat(tokenOut, " for ").concat(amountIn, " ").concat(tokenIn);
                        if (!(((_y = (_x = transactions_1.length[0]) === null || _x === void 0 ? void 0 : _x.info) === null || _y === void 0 ? void 0 : _y.amount) !== ((_0 = (_z = transactions_1[1]) === null || _z === void 0 ? void 0 : _z.info) === null || _0 === void 0 ? void 0 : _0.amount))) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.tokenUtils.getTokenPriceRaydium(transactions_1, nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type, Number(solPriceUsd))];
                    case 7:
                        tokenPrice = _11.sent();
                        tokenToMc = tokenInMint === 'So11111111111111111111111111111111111111112' ? tokenOutMint : tokenInMint;
                        if (!tokenPrice) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.tokenUtils.getTokenMktCap(tokenPrice, tokenToMc, false)];
                    case 8:
                        _a = _11.sent(), tokenMarketCap = _a.tokenMarketCap, supplyAmount = _a.supplyAmount;
                        tokenMc = tokenMarketCap;
                        raydiumTokenPrice = tokenPrice;
                        return [4 /*yield*/, this.tokenUtils.getTokenHoldings(owner, tokenToMc, supplyAmount, false)];
                    case 9:
                        tokenHoldings = _11.sent();
                        currenHoldingPercentage = tokenHoldings.percentage;
                        currentHoldingPrice = tokenHoldings.balance;
                        _11.label = 10;
                    case 10:
                        isLargeBuy = false;
                        if ((nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'buy' && tokenMc) {
                            solAmount = Number(totalSolSwapped || amountIn);
                            isLargeBuy = this.isSignificantBuy(solAmount, Number(solPriceUsd), tokenMc);
                        }
                        isMultiBuy = false;
                        if ((nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'buy') {
                            solAmount = Number(totalSolSwapped || amountIn);
                            isMultiBuy = this.multiBuyTracker.trackBuy(owner, solAmount, tokenInMint);
                        }
                        isMultiSell = false;
                        if ((nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell') {
                            solAmount = Number(totalSolSwapped || amountOut);
                            isMultiSell = this.multiSellTracker.trackSell(owner, solAmount, tokenOutMint);
                        }
                        isWhaleActivity = false;
                        if (amountIn && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell') {
                            isWhaleActivity = this.isWhaleActivity(Number(amountOut));
                        }
                        else if (amountOut && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'buy') {
                            isWhaleActivity = this.isWhaleActivity(Number(amountOut));
                        }
                        return [2 /*return*/, {
                                platform: swap,
                                owner: owner,
                                description: swapDescription,
                                type: nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type,
                                balanceChange: nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.balanceChange,
                                signature: this.transactionSignature,
                                swappedTokenMc: tokenMc,
                                swappedTokenPrice: raydiumTokenPrice,
                                solPrice: solPriceUsd || '',
                                currenHoldingPercentage: currenHoldingPercentage,
                                currentHoldingPrice: currentHoldingPrice,
                                isNew: isNew,
                                isLargeBuy: isLargeBuy,
                                isWhaleActivity: isWhaleActivity,
                                isMultiBuy: isMultiBuy,
                                multiBuyStats: isMultiBuy ? this.multiBuyTracker.getMultiBuyStats(tokenInMint) : undefined,
                                tokenTransfers: {
                                    tokenInSymbol: tokenIn,
                                    tokenInMint: tokenInMint,
                                    tokenAmountIn: amountIn,
                                    tokenOutSymbol: tokenOut,
                                    tokenOutMint: tokenOutMint,
                                    tokenAmountOut: amountOut,
                                },
                                isMultiSell: isMultiSell,
                                multiSellStats: isMultiSell ? this.multiSellTracker.getMultiSellStats(tokenOutMint) : undefined,
                            }];
                    case 11:
                        if (!(transactions_1.length === 1 || ((_2 = (_1 = transactions_1.length[0]) === null || _1 === void 0 ? void 0 : _1.info) === null || _2 === void 0 ? void 0 : _2.amount) === ((_4 = (_3 = transactions_1[1]) === null || _3 === void 0 ? void 0 : _3.info) === null || _4 === void 0 ? void 0 : _4.amount))) return [3 /*break*/, 22];
                        if (!((nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell')) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.tokenUtils.getTokenMintAddressWithFallback(transactions_1)];
                    case 12:
                        tokenOutMint = (_5 = (_11.sent())) !== null && _5 !== void 0 ? _5 : '';
                        tokenInMint = 'So11111111111111111111111111111111111111112';
                        if (tokenOutMint === null) {
                            console.log('NO TOKEN OUT MINT');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.tokenParser.getTokenInfo(tokenOutMint)];
                    case 13:
                        tokenOutInfo = _11.sent();
                        tokenOut = tokenOutInfo.data.symbol.replace(/\x00/g, '');
                        tokenIn = 'SOL';
                        return [3 /*break*/, 17];
                    case 14:
                        tokenOutMint = 'So11111111111111111111111111111111111111112';
                        return [4 /*yield*/, this.tokenUtils.getTokenMintAddressWithFallback(transactions_1)];
                    case 15:
                        tokenInMint = (_6 = (_11.sent())) !== null && _6 !== void 0 ? _6 : '';
                        if (tokenInMint === null) {
                            console.log('NO TOKEN IN MINT');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.tokenParser.getTokenInfo(tokenInMint)];
                    case 16:
                        tokenInInfo = _11.sent();
                        tokenIn = tokenInInfo.data.symbol.replace(/\x00/g, '');
                        tokenOut = 'SOL';
                        _11.label = 17;
                    case 17:
                        formattedAmount = format_numbers_1.FormatNumbers.formatTokenAmount(Number((_8 = (_7 = transactions_1[0]) === null || _7 === void 0 ? void 0 : _7.info) === null || _8 === void 0 ? void 0 : _8.amount));
                        owner = signerAccountAddress ? signerAccountAddress : (_10 = (_9 = transactions_1[0]) === null || _9 === void 0 ? void 0 : _9.info) === null || _10 === void 0 ? void 0 : _10.authority;
                        amountOut = (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell' ? formattedAmount : totalSolSwapped.toFixed(4).toString();
                        amountIn = (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell' ? totalSolSwapped.toFixed(4).toString() : formattedAmount;
                        swapDescription = "".concat(owner, " swapped ").concat(amountOut, " ").concat(tokenOut, " for ").concat(amountIn, " ").concat(tokenIn);
                        tokenMc = null;
                        tokenToMc = tokenInMint === 'So11111111111111111111111111111111111111112' ? tokenOutMint : tokenInMint;
                        return [4 /*yield*/, this.tokenUtils.getTokenPricePumpFun(tokenToMc, solPriceUsd)
                            // console.log('TOKEN PRICE:', tokenPrice)
                        ];
                    case 18:
                        tokenPrice = _11.sent();
                        if (!tokenPrice) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.tokenUtils.getTokenMktCap(tokenPrice, tokenToMc, true)];
                    case 19:
                        _b = _11.sent(), tokenMarketCap = _b.tokenMarketCap, supplyAmount = _b.supplyAmount;
                        tokenMc = tokenMarketCap;
                        return [4 /*yield*/, this.tokenUtils.getTokenHoldings(owner, tokenToMc, supplyAmount, true)];
                    case 20:
                        tokenHoldings = _11.sent();
                        currenHoldingPercentage = tokenHoldings.percentage;
                        currentHoldingPrice = tokenHoldings.balance;
                        _11.label = 21;
                    case 21:
                        isLargeBuy = false;
                        if ((nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'buy' && tokenMc) {
                            solAmount = Number(totalSolSwapped || amountIn);
                            isLargeBuy = this.isSignificantBuy(solAmount, Number(solPriceUsd), tokenMc);
                        }
                        isMultiBuy = false;
                        if ((nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'buy') {
                            solAmount = Number(totalSolSwapped || amountIn);
                            isMultiBuy = this.multiBuyTracker.trackBuy(owner, solAmount, tokenInMint);
                        }
                        isMultiSell = false;
                        if ((nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell') {
                            solAmount = Number(totalSolSwapped || amountOut);
                            isMultiSell = this.multiSellTracker.trackSell(owner, solAmount, tokenOutMint);
                        }
                        isWhaleActivity = false;
                        if (amountIn && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'sell') {
                            isWhaleActivity = this.isWhaleActivity(Number(amountOut));
                        }
                        else if (amountOut && (nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type) === 'buy') {
                            isWhaleActivity = this.isWhaleActivity(Number(amountOut));
                        }
                        return [2 /*return*/, {
                                platform: swap,
                                owner: owner,
                                description: swapDescription,
                                type: nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.type,
                                balanceChange: nativeBalance === null || nativeBalance === void 0 ? void 0 : nativeBalance.balanceChange,
                                signature: this.transactionSignature,
                                swappedTokenMc: tokenMc,
                                swappedTokenPrice: tokenPrice,
                                solPrice: solPriceUsd || '',
                                isNew: isNew,
                                currenHoldingPercentage: currenHoldingPercentage,
                                currentHoldingPrice: currentHoldingPrice,
                                isLargeBuy: isLargeBuy,
                                isWhaleActivity: isWhaleActivity,
                                isMultiBuy: isMultiBuy,
                                multiBuyStats: isMultiBuy ? this.multiBuyTracker.getMultiBuyStats(tokenInMint) : undefined,
                                tokenTransfers: {
                                    tokenInSymbol: tokenIn,
                                    tokenInMint: tokenInMint,
                                    tokenAmountIn: amountIn,
                                    tokenOutSymbol: tokenOut,
                                    tokenOutMint: tokenOutMint,
                                    tokenAmountOut: amountOut,
                                },
                                isMultiSell: isMultiSell,
                                multiSellStats: isMultiSell ? this.multiSellTracker.getMultiSellStats(tokenOutMint) : undefined,
                            }];
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        error_1 = _11.sent();
                        console.log('TRANSACTION_PARSER_ERROR', error_1);
                        return [2 /*return*/];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    return TransactionParser;
}());
exports.TransactionParser = TransactionParser;
