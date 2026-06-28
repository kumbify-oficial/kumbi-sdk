import { fetchRequest } from "../../api/api";
import { APP_CONFIG } from "../../utils/helpers";
import {
  IMakeAngolanPaymentParams,
  IMakeAngolanPaymentResponse,
  IMakeCryptoPaymentParams,
  IMakeCryptoPaymentResponse,
  IMakeStripePaymentParams,
  IMakeStripePaymentResponse,
  IPaymentParams,
} from "./interfaces";

import APIError from "../../errors/APIError";

export class KPaymentClient {
  private config: IPaymentParams = {
    apiKey: "",
    api: {
      lang: "pt",
      version: "v1",
    },
  };

  constructor({ ...data }: IPaymentParams) {
    this.config = data;
  }

  async makeStripePayment({ ...data }: IMakeStripePaymentParams) {
    try {
      const response: IMakeStripePaymentResponse = await fetchRequest({
        url: `${APP_CONFIG.PAYMENT.API_BASE_URL}/stripe`,
        method: "post",
        body: data,
        headers: {
          "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          lang: this.config.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "payment" });
    }
  }

  async makeCryptoPayment({ ...data }: IMakeCryptoPaymentParams) {
    try {
      const response: IMakeCryptoPaymentResponse = await fetchRequest({
        url: `${APP_CONFIG.PAYMENT.API_BASE_URL}/crypto`,
        method: "post",
        body: data,
        headers: {
          "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          lang: this.config.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "payment" });
    }
  }

  async makeAngolanPayment({ ...data }: IMakeAngolanPaymentParams) {
    try {
      const url = `${APP_CONFIG.PAYMENT.API_BASE_URL}/${data.provider}`;
      const response: IMakeAngolanPaymentResponse = await fetchRequest({
        url: url,
        method: "post",
        body: {
          ...data,
        },
        headers: {
          "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          lang: this.config.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "payment" });
    }
  }
}
