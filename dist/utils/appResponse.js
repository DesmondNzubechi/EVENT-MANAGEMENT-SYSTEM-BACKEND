"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppResponse = void 0;
const AppResponse = (res, statusCode, status, message, data) => {
    res.status(statusCode).json({
        status: status,
        message: message,
        data: {
            data,
        },
    });
};
exports.AppResponse = AppResponse;
