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
exports.NativeParser = void 0;
var program_ids_1 = require("../config/program-ids");
var logger_1 = require("../utils/logger");
var NativeParser = /** @class */ (function () {
    function NativeParser() {
    }
    NativeParser.prototype.parse = function (logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, isRelevant, program;
            return __generator(this, function (_b) {
                _a = this.isRelevantTransaction(logs), isRelevant = _a.isRelevant, program = _a.program;
                if (!isRelevant) {
                    return [2 /*return*/, null];
                }
                // Basic implementation - you can expand this based on your needs
                return [2 /*return*/, {
                        type: 'buy',
                        platform: program,
                        owner: logs.signature,
                        signature: logs.signature,
                        tokenTransfers: {
                            tokenAmountIn: '0',
                            tokenAmountOut: '0',
                            tokenInSymbol: '',
                            tokenOutSymbol: '',
                            tokenInMint: '',
                            tokenOutMint: '',
                        },
                        solPrice: '0',
                        swappedTokenPrice: 0,
                        currenHoldingPercentage: '0',
                        currentHoldingPrice: '0',
                        swappedTokenMc: 0,
                        description: '',
                        balanceChange: 0,
                        isNew: false,
                        isLargeBuy: false,
                        isMultiBuy: false,
                        isWhaleActivity: false,
                        multiBuyStats: {
                            uniqueWallets: 0,
                            totalSolAmount: 0,
                            recentBuys: [],
                        },
                        isMultiSell: false,
                        multiSellStats: {
                            uniqueWallets: 0,
                            totalSolAmount: 0,
                            recentSells: [],
                        },
                    }];
            });
        });
    };
    NativeParser.prototype.parseTransaction = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var programIds, program, tokenTransfers, owner, type, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        programIds = tx.transaction.message.accountKeys.map(function (key) { return key.pubkey.toString(); });
                        program = this.getProgramFromIds(programIds);
                        if (!program)
                            return [2 /*return*/, null
                                // Extract token transfers from inner instructions
                            ];
                        tokenTransfers = this.extractTokenTransfers(tx);
                        if (!tokenTransfers)
                            return [2 /*return*/, null];
                        owner = tx.transaction.message.accountKeys[0].pubkey.toString();
                        type = this.determineTransactionType(tx);
                        _a = {
                            type: type,
                            platform: program,
                            owner: owner,
                            signature: tx.transaction.signatures[0],
                            tokenTransfers: tokenTransfers,
                            solPrice: this.calculateSolPrice(tx)
                        };
                        return [4 /*yield*/, this.getTokenPrice(tokenTransfers.tokenInMint)];
                    case 1:
                        _a.swappedTokenPrice = _b.sent();
                        return [4 /*yield*/, this.getHoldingPercentage(owner, tokenTransfers.tokenInMint)];
                    case 2:
                        _a.currenHoldingPercentage = _b.sent();
                        return [4 /*yield*/, this.getHoldingValue(owner, tokenTransfers.tokenInMint)];
                    case 3:
                        _a.currentHoldingPrice = _b.sent();
                        return [4 /*yield*/, this.getTokenMarketCap(tokenTransfers.tokenInMint)];
                    case 4: return [2 /*return*/, (_a.swappedTokenMc = _b.sent(),
                            _a.description = this.generateDescription(type, tokenTransfers),
                            _a.balanceChange = this.calculateBalanceChange(tx),
                            _a.isNew = false,
                            _a.isLargeBuy = false,
                            _a.isMultiBuy = false,
                            _a.isWhaleActivity = false,
                            _a.multiBuyStats = {
                                uniqueWallets: 0,
                                totalSolAmount: 0,
                                recentBuys: [],
                            },
                            _a.isMultiSell = false,
                            _a.multiSellStats = {
                                uniqueWallets: 0,
                                totalSolAmount: 0,
                                recentSells: [],
                            },
                            _a)];
                    case 5:
                        error_1 = _b.sent();
                        logger_1.Logger.error('Error parsing transaction:', error_1);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    NativeParser.prototype.isRelevantTransaction = function (logs) {
        if (!logs.logs || logs.logs.length === 0) {
            return { isRelevant: false, program: null };
        }
        var logString = logs.logs.join(' ');
        if (logString.includes(program_ids_1.PUMP_FUN_PROGRAM_ID)) {
            return { isRelevant: true, program: 'pumpfun' };
        }
        if (logString.includes(program_ids_1.RAYDIUM_PROGRAM_ID)) {
            return { isRelevant: true, program: 'raydium' };
        }
        if (logString.includes(program_ids_1.JUPITER_PROGRAM_ID)) {
            return { isRelevant: true, program: 'jupiter' };
        }
        return { isRelevant: false, program: null };
    };
    NativeParser.prototype.getProgramFromIds = function (programIds) {
        if (programIds.includes(program_ids_1.PUMP_FUN_PROGRAM_ID))
            return 'pumpfun';
        if (programIds.includes(program_ids_1.RAYDIUM_PROGRAM_ID))
            return 'raydium';
        if (programIds.includes(program_ids_1.JUPITER_PROGRAM_ID))
            return 'jupiter';
        return null;
    };
    NativeParser.prototype.extractTokenTransfers = function (tx) {
        var _a, _b;
        var transfers = [];
        (_b = (_a = tx.meta) === null || _a === void 0 ? void 0 : _a.innerInstructions) === null || _b === void 0 ? void 0 : _b.forEach(function (inner) {
            inner.instructions.forEach(function (inst) {
                var _a;
                if ('parsed' in inst && ((_a = inst.parsed) === null || _a === void 0 ? void 0 : _a.type) === 'transfer' && inst.parsed.info.amount) {
                    transfers.push(inst.parsed);
                }
            });
        });
        if (transfers.length < 2)
            return null;
        return {
            tokenAmountIn: transfers[0].info.amount,
            tokenAmountOut: transfers[transfers.length - 1].info.amount,
            tokenInSymbol: 'SOL',
            tokenOutSymbol: 'TOKEN',
            tokenInMint: transfers[0].info.mint,
            tokenOutMint: transfers[transfers.length - 1].info.mint,
        };
    };
    NativeParser.prototype.determineTransactionType = function (tx) {
        // Implement logic to determine if it's a buy or sell
        // This is a simplified example
        return 'buy';
    };
    NativeParser.prototype.calculateSolPrice = function (tx) {
        var _a, _b;
        var preBalance = ((_a = tx.meta) === null || _a === void 0 ? void 0 : _a.preBalances[0]) || 0;
        var postBalance = ((_b = tx.meta) === null || _b === void 0 ? void 0 : _b.postBalances[0]) || 0;
        return ((preBalance - postBalance) / 1e9).toString();
    };
    NativeParser.prototype.calculateBalanceChange = function (tx) {
        var _a, _b;
        return (((_a = tx.meta) === null || _a === void 0 ? void 0 : _a.preBalances[0]) || 0) - (((_b = tx.meta) === null || _b === void 0 ? void 0 : _b.postBalances[0]) || 0);
    };
    NativeParser.prototype.generateDescription = function (type, transfers) {
        return "".concat(type.toUpperCase(), ": ").concat(transfers.tokenAmountIn, " ").concat(transfers.tokenInSymbol, " -> ").concat(transfers.tokenAmountOut, " ").concat(transfers.tokenOutSymbol);
    };
    NativeParser.prototype.getTokenPrice = function (mint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implement token price fetching logic here
                // For now, return a placeholder
                return [2 /*return*/, 0];
            });
        });
    };
    NativeParser.prototype.getHoldingPercentage = function (owner, mint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implement holding percentage calculation
                return [2 /*return*/, '0'];
            });
        });
    };
    NativeParser.prototype.getHoldingValue = function (owner, mint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implement holding value calculation
                return [2 /*return*/, '0'];
            });
        });
    };
    NativeParser.prototype.getTokenMarketCap = function (mint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implement market cap fetching logic
                return [2 /*return*/, 0];
            });
        });
    };
    return NativeParser;
}());
exports.NativeParser = NativeParser;
