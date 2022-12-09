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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const IndexRouter = express_1.default.Router();
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL;
if (!CUSTOMER_SERVICE_URL) {
    throw new Error('CUSTOMER_SERVICE_URL is not set');
}
const traceHeaders = [
    'x-request-id',
    'x-b3-traceid',
    'x-b3-spanid',
    'x-b3-parentspanid',
    'x-b3-sampled',
    'x-b3-flags',
    'b3',
    'x-ot-span-context',
];
function getFowardHeaders(req) {
    const headers = {};
    for (let i = 0; i < 7; i++) {
        const traceHeader = traceHeaders[i];
        const value = req.get(traceHeader);
        if (value) {
            headers[traceHeader] = value;
        }
    }
    const user = req.get('user');
    if (user) {
        headers.user = user;
    }
    const useragent = req.get('user-agent');
    if (useragent) {
        headers['user-agent'] = useragent;
    }
    return headers;
}
function getCustomers(req) {
    return __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line:no-console
        console.log(`Making GET request to: ${CUSTOMER_SERVICE_URL}`);
        const headers = getFowardHeaders(req);
        // tslint:disable-next-line:no-console
        console.log(`Attaching headers: `, headers);
        return axios_1.default.get(CUSTOMER_SERVICE_URL, { headers }).then((res) => {
            return res.data;
        });
    });
}
IndexRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // % of requests that should fail
    const errorRate = process.env.ERROR_RATE || "0";
    const returnCode = process.env.ERROR_STATUS_CODE || "503";
    if (Math.floor((Math.random() * 100) + 1) < parseInt(errorRate, 10)) {
        // tslint:disable-next-line:no-console
        console.log('ERROR_RATE is set, injecting error');
        res.status(parseInt(returnCode, 10)).send(`Failure injection (${errorRate}%, HTTP ${returnCode})- something went wrong`);
        return;
    }
    try {
        const customers = yield getCustomers(req);
        res.render('index', { customers });
    }
    catch (err) {
        const ua = req.get('user-agent');
        if (ua && ua.includes('curl')) {
            res.json(err.message);
            return;
        }
        // tslint:disable-next-line:no-console
        console.log(err);
        res.render('error', {
            message: 'Error calling downstream service',
            error: err,
        });
    }
}));
exports.default = IndexRouter;
//# sourceMappingURL=index.js.map