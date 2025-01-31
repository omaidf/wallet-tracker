"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUMP_CURVE_STATE_OFFSETS = exports.PUMP_CURVE_STATE_SIZE = exports.PUMP_CURVE_STATE_SIGNATURE = exports.PUMP_CURVE_TOKEN_DECIMALS = exports.PUMP_FUN_TOKEN_MINT_AUTH = exports.JUPITER_PROGRAM_ID = exports.RAYDIUM_PROGRAM_ID = exports.PUMP_FUN_PROGRAM_ID = void 0;
exports.PUMP_FUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
exports.RAYDIUM_PROGRAM_ID = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
exports.JUPITER_PROGRAM_ID = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';
exports.PUMP_FUN_TOKEN_MINT_AUTH = 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM';
exports.PUMP_CURVE_TOKEN_DECIMALS = 6;
// Calculated as the first 8 bytes of: `sha256("account:BondingCurve")`.
exports.PUMP_CURVE_STATE_SIGNATURE = Uint8Array.from([0x17, 0xb7, 0xf8, 0x37, 0x60, 0xd8, 0xac, 0x60]);
exports.PUMP_CURVE_STATE_SIZE = 0x29;
exports.PUMP_CURVE_STATE_OFFSETS = {
    VIRTUAL_TOKEN_RESERVES: 0x08,
    VIRTUAL_SOL_RESERVES: 0x10,
    REAL_TOKEN_RESERVES: 0x18,
    REAL_SOL_RESERVES: 0x20,
    TOKEN_TOTAL_SUPPLY: 0x28,
    COMPLETE: 0x30,
};
