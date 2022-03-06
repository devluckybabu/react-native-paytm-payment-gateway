declare const callback: (path: string, data: object, config: {
    merchantId: string;
    merchantKey: string;
    mode: string;
}) => Promise<unknown>;
export default callback;
