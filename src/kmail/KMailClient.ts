import {
  IKMailResponseMail,
  IKMailSendMailSimpleMessage,
  IKMailSendMailTemplateMessage,
} from "../utils/types";
import { APP_CONFIG } from "../utils/helpers";
import { AxiosError } from "axios";

import axios from "axios";

export class KMailClient {
  apiKey;
  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  async sendSimpleMail({ ...data }: IKMailSendMailSimpleMessage) {
    try {
      const response = await axios.post<IKMailResponseMail>(
        APP_CONFIG.KMAIL_URL + "/send",
        {
          ...data,
        },
        { headers: { "kumbi-api-key": "Bearer " + this.apiKey } },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Message: " + error.response.data);
      }
      throw new Error("Failed while send simple mail: " + error);
    }
  }

  async sendTemplateMail({ ...data }: IKMailSendMailTemplateMessage) {
    try {
      const response = await axios.post<IKMailResponseMail>(
        APP_CONFIG.KMAIL_URL + "/send",
        {
          ...data,
        },
        { headers: { "kumbi-api-key": "Bearer " + this.apiKey } },
      );

      return response.data;
    } catch (err) {
      throw new Error("Failed while send template mail: " + err);
    }
  }
}
