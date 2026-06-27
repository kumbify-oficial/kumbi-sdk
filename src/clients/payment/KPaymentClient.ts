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
    provider: {
      angolan: {
        seller: "paypay",
      },
      type: "angolan",
    },
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
        url: `${APP_CONFIG.PAYMENT.API_BASE_URL}/${this.config.provider.international.seller}`,
        method: "post",
        body: data,
        headers: {
          "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          "accept-language": this.config.api.lang,
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
        url: `${APP_CONFIG.PAYMENT.API_BASE_URL}/${this.config.provider.international.seller}`,
        method: "post",
        body: data,
        headers: {
          "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          "accept-language": this.config.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "payment" });
    }
  }

  async makeAngolanPayment({ ...data }: IMakeAngolanPaymentParams) {
    try {
      if (
        this.config.provider.angolan.seller == "paypay" &&
        data.method == "multicaixa"
      ) {
        let message = {
          pt: "O método de pagamento via multicaixa express está indisponível para PayPay",
          en: "The Multicaixa Express payment method is unavailable for PayPay",
        };

        APIError.ErrorMessage({
          section: "payment",
          message: this.config.api.lang == "en" ? message.en : message.pt,
        });
      }

      const url = `${APP_CONFIG.PAYMENT.API_BASE_URL}/${this.config.provider.angolan}`;
      const response: IMakeAngolanPaymentResponse = await fetchRequest({
        url: url,
        method: "post",
        body: {
          ...data,
        },
        headers: {
          "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          "accept-language": this.config.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "payment" });
    }
  }
}
