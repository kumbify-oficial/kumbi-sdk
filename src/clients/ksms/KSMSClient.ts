import { APP_CONFIG } from "../../utils/helpers";
import {
  IAPIConfig,
  IKSMSResponseMessage,
  IKSMSSendMessage,
} from "../../utils/types";
import { fetchRequest } from "../../api/api";

import APIError from "../../errors/APIError";

interface IKSMSParams {
  apiKey: string;
  api?: IAPIConfig;
}

export class KSMSClient {
  private config: IKSMSParams = {
    apiKey: "",
    api: {
      lang: "pt",
      version: "v1",
    },
  };

  constructor({ ...data }: IKSMSParams) {
    this.config = data;
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
          "kumbi-api-key": "Bearer " + this.config.apiKey,
          "accept-language": this.config.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "sms" });
    }
  }
}
