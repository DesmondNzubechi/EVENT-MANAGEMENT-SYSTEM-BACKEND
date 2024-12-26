"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
const express_1 = __importDefault(require("express"));
const errorController_1 = __importDefault(require("./errors/errorController"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const eventRoute_1 = __importDefault(require("./routes/eventRoute"));
const bookingRoute_1 = __importDefault(require("./routes/bookingRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, // Allow credentials (cookies)
    methods: 'GET,POST,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization, api_key',
};
// Use CORS middleware
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("THIS API IS WORKING AS EXPECTED");
});
exports.swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "EVENT BOOKING PLATFORM API",
            version: "1.0.0",
            description: `
      `,
        },
        servers: [
            {
                url: process.env.backendUrl,
            },
        ],
        components: {
            schemas: {
                Auth: {},
                Event: {},
                Booking: {},
                User: {},
            },
        },
    },
    apis: ["./routes/*.ts"], // Path to your route files
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(exports.swaggerOptions);
app.use("/api-docs", express_1.default.static("node_modules/swagger-ui-dist/", { index: false }), swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Serve the Swagger UI static assets (CSS, JS, etc.)
app.use("/api-docs", express_1.default.static(path_1.default.join(__dirname, "node_modules/swagger-ui-dist")));
app.use("/api-docs/swagger-ui.css", express_1.default.static(path_1.default.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui.css")));
app.use("/api-docs/swagger-ui-bundle.js", express_1.default.static(path_1.default.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui-bundle.js")));
app.use("/api-docs/swagger-ui-standalone-preset.js", express_1.default.static(path_1.default.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js")));
app.use("/api-docs/swagger-ui-init.js", express_1.default.static(path_1.default.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui-init.js")));
app.use((req, res, next) => {
    console.log("hello from this middleware");
    next();
});
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/event", eventRoute_1.default);
app.use("/api/v1/booking", bookingRoute_1.default);
app.use("/api/v1/user", userRoute_1.default);
app.all("*", (req, res, next) => {
    throw new Error("This route does not exist");
});
app.use(errorController_1.default);
exports.default = app;
