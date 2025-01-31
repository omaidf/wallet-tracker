"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxMessages = void 0;
var format_numbers_1 = require("../../lib/format-numbers");
var chalk_1 = require("chalk");
var trade_config_1 = require("../../lib/config/trade-config");
var TxMessages = /** @class */ (function () {
    function TxMessages() {
    }
    TxMessages.txMadeMessage = function (message, tokenMarketCap, walletName) {
        var _a, _b;
        var owner = message.owner;
        var amountOut = message.tokenTransfers.tokenAmountOut;
        var tokenOut = message.tokenTransfers.tokenOutSymbol;
        var amountIn = message.tokenTransfers.tokenAmountIn;
        var tokenIn = message.tokenTransfers.tokenInSymbol;
        var truncatedOwner = "".concat(owner.slice(0, 4), "...").concat(owner.slice(-4));
        var solscanAddressUrl = "https://solscan.io/account/".concat(owner);
        var solscanTokenOutUrl = "https://solscan.io/token/".concat(message.tokenTransfers.tokenOutMint);
        var solscanTokenInUrl = "https://solscan.io/token/".concat(message.tokenTransfers.tokenInMint);
        var solscanTxUrl = "https://solscan.io/tx/".concat(message.signature);
        var tokenInMint = message.tokenTransfers.tokenInMint;
        var tokenOutMint = message.tokenTransfers.tokenOutMint;
        var solPrice = Number(message.solPrice);
        var amountInUsd = message.type === 'buy' ? Number(amountOut) * solPrice : Number(amountIn) * solPrice;
        // const fixedUsdAmount = amountInUsd < 0.01 ? amountInUsd.toFixed(6) : amountInUsd.toFixed(2)
        var fixedUsdAmount = format_numbers_1.FormatNumbers.formatPrice(amountInUsd);
        // const displayPercentage =
        //   isFinite(Number(message.currenHoldingPercentage)) && Number(message.currenHoldingPercentage) > 0
        //     ? `${message.currenHoldingPercentage}%`
        //     : '0'
        var tokenMintToTrack = message.type === 'buy' ? tokenInMint : tokenOutMint;
        var gmgnLink = "<a href=\"https://gmgn.ai/sol/token/kxPdcLKf_".concat(tokenMintToTrack, "\">GMGN</a>");
        var beLink = "<a href=\"https://birdeye.so/token/".concat(tokenMintToTrack, "?chain=solana\">BE</a>");
        var dsLink = "<a href=\"https://dexscreener.com/solana/".concat(tokenMintToTrack, "\">DS</a>");
        var phLink = "<a href=\"https://photon-sol.tinyastro.io/en/lp/".concat(tokenMintToTrack, "\">PH</a>");
        var bullxLink = "<a href=\"https://neo.bullx.io/terminal?chainId=1399811149&address=".concat(tokenMintToTrack, "\">Bullx</a>");
        var marketCapText = tokenMarketCap
            ? "\uD83D\uDD17 ".concat(message.type === 'buy' ? "<b><a href=\"".concat(solscanTokenInUrl, "\">#").concat(tokenIn, "</a></b>") : "<b><a href=\"".concat(solscanTokenOutUrl, "\">#").concat(tokenOut, "</a></b>"), " | <b>MC: $").concat(tokenMarketCap, "</b> | ").concat(gmgnLink, " \u2022 ").concat(beLink, " \u2022 ").concat(dsLink, " \u2022 ").concat(phLink, " \u2022 ").concat(bullxLink)
            : '';
        var messageText = "\n".concat(message.type === 'buy' ? '🟢' : '🔴', " <b><a href=\"").concat(solscanTxUrl, "\">").concat((_a = message.type) === null || _a === void 0 ? void 0 : _a.toUpperCase(), " ").concat(message.type === 'buy' ? "".concat(tokenIn) : "".concat(tokenOut), "</a></b> on ").concat(message.platform.toUpperCase(), "\n<b>\uD83D\uDC8E ").concat(walletName !== '' ? walletName : truncatedOwner, "</b>\n\n\uD83D\uDC8E <b><a href=\"").concat(solscanAddressUrl, "\">").concat(walletName !== '' ? walletName : truncatedOwner, "</a></b> swapped <b>").concat(amountOut, "</b>").concat(message.type === 'sell' ? " ($".concat(fixedUsdAmount, ")") : '', " <b><a href=\"").concat(solscanTokenOutUrl, "\">").concat(tokenOut, "</a></b> for <b>").concat(amountIn, "</b>").concat(message.type === 'buy' ? " ($".concat(fixedUsdAmount, ")") : '', " <b><a href=\"").concat(solscanTokenInUrl, "\">").concat(tokenIn, "</a></b> @$").concat((_b = message.swappedTokenPrice) === null || _b === void 0 ? void 0 : _b.toFixed(7), "\n\n").concat(Number(message.currenHoldingPercentage) > 0 ? '📈' : '📉', " <b>HOLDS: ").concat(message.currentHoldingPrice, " (").concat(message.currenHoldingPercentage, "%)</b>\n").concat(marketCapText, "\n<code>").concat(tokenMintToTrack, "</code>\n");
        return messageText;
    };
    TxMessages.tokenMintedMessage = function (message, walletName) {
        var owner = message.owner;
        var amountOut = message.tokenTransfers.tokenAmountOut;
        var tokenOut = message.tokenTransfers.tokenOutSymbol;
        var amountIn = message.tokenTransfers.tokenAmountIn;
        var tokenIn = message.tokenTransfers.tokenInSymbol;
        var truncatedOwner = "".concat(owner.slice(0, 4), "...").concat(owner.slice(-4));
        var solscanAddressUrl = "https://solscan.io/account/".concat(owner);
        var solscanTokenOutUrl = "https://solscan.io/token/".concat(message.tokenTransfers.tokenOutMint);
        var solscanTokenInUrl = "https://solscan.io/token/".concat(message.tokenTransfers.tokenInMint);
        var solscanTxUrl = "https://solscan.io/tx/".concat(message.signature);
        var tokenInMint = message.tokenTransfers.tokenInMint;
        var solPrice = Number(message.solPrice);
        var amountInUsd = message.type === 'buy' ? Number(amountOut) * solPrice : Number(amountIn) * solPrice;
        var fixedUsdAmount = amountInUsd < 0.01 ? amountInUsd.toFixed(6) : amountInUsd.toFixed(2);
        var tokenMintToTrack = tokenInMint;
        var gmgnLink = "<a href=\"https://gmgn.ai/sol/token/".concat(tokenMintToTrack, "\">GMGN</a>");
        var beLink = "<a href=\"https://birdeye.so/token/".concat(tokenMintToTrack, "?chain=solana\">BE</a>");
        var dsLink = "<a href=\"https://dexscreener.com/solana/".concat(tokenMintToTrack, "\">DS</a>");
        var phLink = "<a href=\"https://photon-sol.tinyastro.io/en/lp/".concat(tokenMintToTrack, "\">PH</a>");
        var messageText = "\n\u2B50\uD83D\uDD01 <a href=\"".concat(solscanTxUrl, "\">SWAP</a> on PUMPFUN\n<b>\uD83D\uDC8E ").concat(walletName !== '' ? walletName : truncatedOwner, "</b>\n\n\uD83D\uDC8E <a href=\"").concat(solscanAddressUrl, "\">").concat(walletName !== '' ? walletName : truncatedOwner, "</a> minted and swapped <b>").concat(amountOut, "</b><a href=\"").concat(solscanTokenOutUrl, "\">").concat(tokenOut, "</a> for <b>").concat(amountIn, "</b>($").concat(fixedUsdAmount, ") <a href=\"").concat(solscanTokenInUrl, "\">").concat(tokenIn, "</a> \n\n<b>\uD83D\uDCA3 ").concat(tokenIn, "</b>| ").concat(gmgnLink, " \u2022 ").concat(beLink, " \u2022 ").concat(dsLink, " \u2022 ").concat(phLink, "\n\n<code>").concat(tokenMintToTrack, "</code>   \n");
        return messageText;
    };
    TxMessages.prototype.formatTransactionMessage = function (tx) {
        var _a, _b;
        var truncatedOwner = "".concat(tx.owner.slice(0, 4), "...").concat(tx.owner.slice(-4));
        var formattedMc = tx.swappedTokenMc ? format_numbers_1.FormatNumbers.formatPrice(tx.swappedTokenMc) : 'N/A';
        var message = "\n".concat(tx.isWhaleActivity ? '🐳 Whale Activity' : '', "\n").concat(tx.type === 'buy' ? chalk_1.default.green('🟢 BUY') : chalk_1.default.red('🔴 SELL'), " on ").concat(chalk_1.default.yellow((_a = tx.platform) === null || _a === void 0 ? void 0 : _a.toUpperCase()), "\n\uD83D\uDC8E Wallet: ").concat(truncatedOwner, "\n\uD83D\uDD17 Signature: ").concat(tx.signature, "\n").concat(tx.description, "\nPrice: $").concat((_b = tx.swappedTokenPrice) === null || _b === void 0 ? void 0 : _b.toFixed(7), "\nMarket Cap: $").concat(formattedMc, "\nHoldings: ").concat(tx.currentHoldingPrice, " (").concat(tx.currenHoldingPercentage, "%)\n").concat(tx.isLargeBuy ? '🔥 Large Buy' : '', "\n");
        if (tx.isMultiBuy && tx.multiBuyStats) {
            message += "\n\uD83D\uDD25 Multi-Buy Alert!\n".concat(tx.multiBuyStats.uniqueWallets, " wallets bought in the last ").concat(trade_config_1.TRADE_CONFIG.MULTI_BUY.TIME_WINDOW_HOURS, "h\nTotal SOL: ").concat(tx.multiBuyStats.totalSolAmount.toFixed(2), " SOL");
        }
        if (tx.isMultiSell && tx.multiSellStats) {
            message += "\n\uD83D\uDD25 Multi-Sell Alert!\n".concat(tx.multiSellStats.uniqueWallets, " wallets sold in the last ").concat(trade_config_1.TRADE_CONFIG.MULTI_SELL.TIME_WINDOW_HOURS, "h\nTotal SOL: ").concat(tx.multiSellStats.totalSolAmount.toFixed(2), " SOL");
        }
        return message;
    };
    return TxMessages;
}());
exports.TxMessages = TxMessages;
