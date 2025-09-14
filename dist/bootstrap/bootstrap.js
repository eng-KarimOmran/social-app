"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("../routes"));
const globalErrorHandler_1 = __importDefault(require("../middlewares/globalErrorHandler"));
const db_connect_1 = require("../db/db.connect");
dotenv_1.default.config({ path: path_1.default.resolve("./src/config/.env") });
const app = (0, express_1.default)();
const bootstrap = async () => {
    await (0, db_connect_1.connectDB)();
    app.use(express_1.default.json());
    app.use("/api/v1/", routes_1.default);
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome to the server" });
    });
    app.use(globalErrorHandler_1.default);
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });
};
exports.bootstrap = bootstrap;
