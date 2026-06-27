import { APP_CONFIG } from "../utils/helpers";
import {
  IAPIConfig,
  IKSMSResponseMessage,
  IKSMSSendMessage,
} from "../utils/types";
import { fetchRequest } from "../api/api";

import APIError from "../errors/APIError";

export class KSMSClient {
  private apiKey;
  private api: IAPIConfig = { lang: "pt", version: "v1" };

  constructor({ apiKey, api }: { apiKey: string; api?: IAPIConfig }) {
    this.apiKey = apiKey;
    this.api = api;
  }

  async sendSMS({ ...data }: IKSMSSendMessage) {
    try {
      const response: IKSMSResponseMessage = await fetchRequest({
        url: APP_CONFIG.KSMS_URL + "/send",
        method: "post",
        body: {
          body: data.message,
          to: data.to,
          from: data.from,
        },
        headers: {
          "kumbi-api-key": "Bearer " + this.apiKey,
          "accept-language": this.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "sms" });
    }
  }
}
