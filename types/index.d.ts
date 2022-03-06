interface productInfo {
    productId?: string;
    orderId?: string;
    description: string;
    price: string;
    quantity: string;
    category?: string;
    currency: "INR" | string;
    image?: string;
}
interface TxnTokenOptions {
    orderId: string;
    amount: string;
    userId: string;
    user?: {
        firstName?: string;
        lastName?: string;
        mobile?: string;
        email?: string;
    };
    productInfo?: {
        productId?: string;
        description: string;
        quantity: string;
        category?: string;
        image?: string;
    };
}
declare class paytmConfig {
    private merchantKey;
    private merchantId;
    private mode;
    constructor(config: {
        key: string;
        mid: string;
        mode: "development" | "production";
    });
    private call;
    getTxnToken: ({ productInfo, amount, user, orderId, userId }: TxnTokenOptions) => Promise<unknown>;
    startTransaction: (options: {
        orderId: string;
        txnToken: string;
        restrictAppInvoke: boolean;
        amount: string;
    }) => Promise<any>;
    getPaymentStatus: (options: {
        orderId: string;
        txnId: string;
        txnType?: "PREAUTH" | "RELEASE" | "CAPTURE" | "WITHDRAW";
    }) => Promise<unknown>;
    getRefundStatus: (options: {
        orderId: string;
        refundId: string;
    }) => Promise<unknown>;
    requestRefund: (options: {
        refundId: string;
        orderId: string;
        amount: string;
        txnId: string;
    }) => Promise<unknown>;
    updateTransaction: (options: {
        productInfo: productInfo;
        amount: string;
        orderId: string;
        currency: "INR" | "USD";
    }) => Promise<unknown>;
    getPaymentOptions: (orderId: string) => Promise<unknown>;
}
declare const paytm: {
    config: typeof paytmConfig;
};
export default paytm;
