"use strict";
const url = "https://react-native-paytm-gateway.herokuapp.com/api";

const convert = (result: any) => {
  const json_data = JSON.parse(result);
  return json_data?.body;
};

//callback
const callback = (
  path: string,
  data: object,
  config: {
    merchantId: string;
    merchantKey: string;
    mode: string;
  }) => {
  return new Promise((resolve, reject) => {
    if (path && data && config) {
      const full_url = url + path + '/' + config.mode;
      fetch(full_url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json", key: config.merchantKey, mid: config?.merchantId },
        body: JSON.stringify(data)
      }).then((res) => res.json()).then((result) => {
        const data = convert(result);
        if (data?.resultInfo?.resultStatus == "S") {
          return resolve(data);
        } else {
          return reject(data);
        };
      }).catch((error) => reject(error));
    } else {
      return reject({ error: true, message: 'Required parameter missing.' })
    }
  });
};

export default callback;