import { IKMailResponseMail, IKMailSendMailSimpleMessage, IKMailSendMailTemplateMessage } from "../utils/types";
import { APP_CONFIG } from "@/utils/helpers";

import axios from "axios";

export class KMailServer {
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
    } catch (err) {
      throw new Error("Failed while send simple mail: " + err);
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
      throw new Error("Failed while send simple mail: " + err);
    }
  }
}
