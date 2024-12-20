"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './config.env' });
const { PORT, DATABASE_URL } = process.env;
if (!PORT || !DATABASE_URL) {
    throw new Error("Make sure that the database url and the port is defined");
}
const DB = DATABASE_URL;
mongoose_1.default.connect(DB).then(() => {
    console.log("connection successful");
}).catch((error) => {
    console.log("An error occured during connection", error);
});
App_1.default.listen(PORT, () => {
    console.log(`This app is running on port ${PORT}`);
});
