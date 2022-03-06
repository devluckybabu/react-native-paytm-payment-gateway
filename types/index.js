"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paytm_allinone_react_native_1 = __importDefault(require("paytm_allinone_react-native"));
const callback_1 = __importDefault(require("./lib/callback"));
const dev_url = "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=";
const pro_url = "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=";
;
class paytmConfig {
    constructor(config) {
        this.call = (path, data) => (0, callback_1.default)(path, data, { merchantId: this.merchantId, merchantKey: this.merchantKey, mode: this.mode });
        this.getTxnToken = ({ productInfo, amount, user, orderId, userId }) => {
            return new Promise((resolve, reject) => {
                const product = productInfo && typeof productInfo == "object" ? Object.assign({ orderId, price: amount, currency: 'INR' }, productInfo) : '';
                const data = { amount, orderId, userId, user: Object.assign(Object.assign({}, user), { userId }), productInfo: product };
                this.call('/payment/create', data)
                    .then((result) => resolve(result))
                    .catch((error) => reject(error));
            });
        };
        this.startTransaction = (options) => {
            const production = this.mode == "production";
            const { orderId, txnToken, amount, restrictAppInvoke } = options;
            const isStaging = !production;
            const callbackUrl = production ? pro_url + orderId : dev_url + orderId;
            return paytm_allinone_react_native_1.default.startTransaction(orderId, this.merchantId, txnToken, String(amount), callbackUrl, isStaging, restrictAppInvoke, '');
        };
        this.getPaymentStatus = (options) => this.call('/payment/status', options);
        this.getRefundStatus = (options) => this.call('/refund/status', options);
        this.requestRefund = (options) => {
            return this.call('/refund/request', options);
        };
        this.updateTransaction = (options) => this.call('/payment/update', options);
        this.getPaymentOptions = (orderId) => this.call('/payment/options', { orderId });
        this.getOffers = () => this.call('/offers', {});
        this.merchantKey = config.key;
        this.merchantId = config.mid;
        this.mode = config.mode;
    }
    ;
}
;
const config = paytmConfig;
const paytm = { config };
exports.default = paytm;
//# sourceMappingURL=index.js.map