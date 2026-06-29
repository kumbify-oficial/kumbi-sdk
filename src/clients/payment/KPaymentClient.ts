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

  async verifyWebhook({
    pubKey,
    req,
    secret,
  }: {
    /** Request */
    req: {
      body: Record<string, any>;
      headers: Record<string, any>;
    };

    /** Your webhook secret */
    secret: string;

    /** Your public Key */
    pubKey: string;
  }) {
    try {
      let errorMessage = { en: "", pt: "", status: "success" };

      const payload = req.body;

      const signature = req.headers["kumbi-sign-payload"];
      const webhookSecret = req.headers["kumbi-sign-webhook"];

      if (signature || webhookSecret) {
        errorMessage.en = "Invalid Request";
        errorMessage.pt = "Requisição inválida";
        APIError.ErrorMessage({
          section: "payment",
          message: APIError.LangMessage({
            lang: this.config.api.lang,
            en: errorMessage.en,
            pt: errorMessage.pt,
          }),
        });
      }

      if (webhookSecret != secret) {
        errorMessage.en = "Invalid Request - Incorrect secret";
        errorMessage.pt = "Requisição inválida - Segredo incorreto";
        APIError.ErrorMessage({
          section: "payment",
          message: APIError.LangMessage({
            lang: this.config.api.lang,
            en: errorMessage.en,
            pt: errorMessage.pt,
          }),
        });
      }

      const isValidSign = await this.verifySign({
        payload,
        pubKey,
        signature,
      });

      if (!isValidSign) {
        errorMessage.en = "Invalid Signature";
        errorMessage.pt = "Assinatura inválida";
        APIError.ErrorMessage({
          section: "payment",
          message: APIError.LangMessage({
            lang: this.config.api.lang,
            en: errorMessage.en,
            pt: errorMessage.pt,
          }),
        });
      }

      return true;
    } catch (error) {
      APIError.CatchError({ error, section: "payment" });
    }
  }

  private async verifySign({
    payload,
    pubKey,
    signature,
  }: {
    pubKey: string;
    signature: string;
    payload: Record<string, any>;
  }) {
    try {
      const pemContents = pubKey
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\s+/g, "");

      const binaryDerString = atob(pemContents);
      const binaryDer = new Uint8Array(binaryDerString.length);
      for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
      }

      const publicKey = await crypto.subtle.importKey(
        "spki",
        binaryDer.buffer,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        false,
        ["verify"],
      );

      const signatureBuffer = new Uint8Array(signature.length / 2);
      for (let i = 0; i < signature.length; i += 2) {
        signatureBuffer[i / 2] = parseInt(signature.substring(i, i + 2), 16);
      }

      const dataString =
        typeof payload === "object" ? JSON.stringify(payload) : payload;
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(dataString);

      const isValid = await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        publicKey,
        signatureBuffer,
        dataBuffer,
      );

      return isValid;
    } catch (error) {
      return false;
    }
  }
}
