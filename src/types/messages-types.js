"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsMessageEnum = void 0;
var PaymentsMessageEnum;
(function (PaymentsMessageEnum) {
    PaymentsMessageEnum[PaymentsMessageEnum["NO_USER_FOUND"] = 0] = "NO_USER_FOUND";
    PaymentsMessageEnum[PaymentsMessageEnum["INSUFFICIENT_BALANCE"] = 1] = "INSUFFICIENT_BALANCE";
    PaymentsMessageEnum[PaymentsMessageEnum["INVALID_PLAN"] = 2] = "INVALID_PLAN";
    PaymentsMessageEnum[PaymentsMessageEnum["PLAN_UPGRADED"] = 3] = "PLAN_UPGRADED";
    PaymentsMessageEnum[PaymentsMessageEnum["DONATION_MADE"] = 4] = "DONATION_MADE";
    PaymentsMessageEnum[PaymentsMessageEnum["INTERNAL_ERROR"] = 5] = "INTERNAL_ERROR";
    PaymentsMessageEnum[PaymentsMessageEnum["USER_ALREADY_PAID"] = 6] = "USER_ALREADY_PAID";
    PaymentsMessageEnum[PaymentsMessageEnum["TRANSACTION_SUCCESS"] = 7] = "TRANSACTION_SUCCESS";
})(PaymentsMessageEnum || (exports.PaymentsMessageEnum = PaymentsMessageEnum = {}));
