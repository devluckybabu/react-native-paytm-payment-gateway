"use strict"
import AllInOneSDKManager from 'paytm_allinone_react-native';
import callback from './lib/callback';
const dev_url = "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=";
const pro_url = "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=";

interface productInfo {
  productId?: string;
  orderId?: string;
  description: string;
  price: string;
  quantity: string;
  category?: string;
  currency: "INR" | string;
  image?: string;
};



interface TxnTokenOptions {
  orderId: string;
  amount: string;
  userId: string;
  user?: {
    firstName?: string;
    lastName?: string;
    mobile?: string;
    email?: string;
  },
  productInfo?: {
    productId?: string;
    description: string;
    quantity: string;
    category?: string;
    image?: string;
  }
}

class paytmConfig {
  private merchantKey: string;
  private merchantId: string;
  private mode: string;
  constructor(config: { key: string; mid: string; mode: "development" | "production" }) {
    this.merchantKey = config.key;
    this.merchantId = config.mid;
    this.mode = config.mode;
  };

  ////headers config
  private call = (path: string, data: object) => callback(path, data, { merchantId: this.merchantId, merchantKey: this.merchantKey, mode: this.mode });

  getTxnToken = ({ productInfo, amount, user, orderId, userId }: TxnTokenOptions) => {
    return new Promise((resolve, reject) => {
      const product = productInfo && typeof productInfo == "object" ? {
        orderId, price: amount, currency: 'INR', ...productInfo
      } : '';
      const data = { amount, orderId, userId, user: { ...user, userId }, productInfo: product };
      this.call('/payment/create', data)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  };


  //transaction start
  startTransaction = (
    options: {
      orderId: string;
      txnToken: string;
      restrictAppInvoke: boolean;
      amount: string;
    }) => {
    const production = this.mode == "production";
    const { orderId, txnToken, amount, restrictAppInvoke } = options;
    const isStaging = !production;
    const callbackUrl = production ? pro_url + orderId : dev_url + orderId;
    return AllInOneSDKManager.startTransaction(orderId, this.merchantId, txnToken, String(amount), callbackUrl, isStaging, restrictAppInvoke, '');
  };

  //get payment status
  getPaymentStatus = (
    options: {
      orderId: string;
      txnId: string;
      txnType?: "PREAUTH" | "RELEASE" | "CAPTURE" | "WITHDRAW"
    }) => this.call('/payment/status', options);

  //get refund status
  getRefundStatus = (options: { orderId: string; refundId: string }) => this.call('/refund/status', options);

  //request refund
  requestRefund = (
    options: {
      refundId: string;
      orderId: string;
      amount: string;
      txnId: string;
    }) => {
    return this.call('/refund/request', options);
  };

  ///update order details
  updateTransaction = (
    options: {
      productInfo: productInfo,
      amount: string;
      orderId: string;
      currency: "INR" | "USD"
    }) => this.call('/payment/update', options);

  ///get payment options
  getPaymentOptions = (orderId: string) => this.call('/payment/options', { orderId });
  ///get payment options
  getOffers = () => this.call('/offers', {});
};

const config = paytmConfig;
const paytm = { config }
export default paytm;