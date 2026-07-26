"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonConfig = void 0;
const winston = require("winston");
exports.winstonConfig = {
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.colorize({ all: true }), winston.format.printf((info) => `[${info.timestamp}] [${info.level}] ${info.context ? '[' + info.context + '] ' : ''}${info.message}`)),
        }),
    ],
};
//# sourceMappingURL=winston.config.js.map