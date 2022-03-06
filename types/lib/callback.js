"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = "https://react-native-paytm-gateway.herokuapp.com/api";
const convert = (result) => {
    const json_data = JSON.parse(result);
    return json_data === null || json_data === void 0 ? void 0 : json_data.body;
};
const callback = (path, data, config) => {
    return new Promise((resolve, reject) => {
        if (path && data && config) {
            const full_url = url + path + '/' + config.mode;
            fetch(full_url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json", key: config.merchantKey, mid: config === null || config === void 0 ? void 0 : config.merchantId },
                body: JSON.stringify(data)
            }).then((res) => res.json()).then((result) => {
                var _a;
                const data = convert(result);
                if (((_a = data === null || data === void 0 ? void 0 : data.resultInfo) === null || _a === void 0 ? void 0 : _a.resultStatus) == "S") {
                    return resolve(data);
                }
                else {
                    return reject(data);
                }
                ;
            }).catch((error) => reject(error));
        }
        else {
            return reject({ error: true, message: 'Required parameter missing.' });
        }
    });
};
exports.default = callback;
//# sourceMappingURL=callback.js.map