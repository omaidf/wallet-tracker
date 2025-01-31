"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleNotificationHandler = void 0;
var tx_messages_1 = require("../bot/messages/tx-messages");
var logger_1 = require("../utils/logger");
var ConsoleNotificationHandler = /** @class */ (function () {
    function ConsoleNotificationHandler() {
        this.txMessages = new tx_messages_1.TxMessages();
    }
    ConsoleNotificationHandler.prototype.send = function (message) {
        try {
            var formattedMessage = this.txMessages.formatTransactionMessage(message);
            logger_1.Logger.info('\nNew Transaction:');
            console.log(formattedMessage);
            console.log('----------------------------------------');
        }
        catch (error) {
            logger_1.Logger.error('Error formatting transaction message:', error);
        }
    };
    return ConsoleNotificationHandler;
}());
exports.ConsoleNotificationHandler = ConsoleNotificationHandler;
