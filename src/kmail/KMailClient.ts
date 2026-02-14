import {
  IKMailResponseMail,
  IKMailSendMailSimpleMessage,
  IKMailSendMailTemplateMessage,
} from "../utils/types";
import { APP_CONFIG } from "../utils/helpers";

import axios from "axios";

export class KMailClient {
  private apiKey;
  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  async sendSimpleMail({ ...data }: IKMailSendMailSimpleMessage) {
    try {
      const response = await axios.post<IKMailResponseMail>(
        APP_CONFIG.KMAIL_URL + "/send",
        {
          from_address: data.from,
          to_address: data.to,
          subject: data.subject,
          body_html: data.body.html,
          body_text: data.body.text,
        },
        { headers: { "kumbi-api-key": "Bearer " + this.apiKey } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        throw new Error(
          `Mail failed (status: ${status}): ${JSON.stringify(data)}`,
        );
      }

      throw new Error(`Mail failed: ${String(error)}`);
    }
  }

  async sendTemplateMail({ ...data }: IKMailSendMailTemplateMessage) {
    try {
      const response = await axios.post<IKMailResponseMail>(
        APP_CONFIG.KMAIL_URL + "/send",
        {
          from_address: data.from,
          to_address: data.to,
          template_name: data.template.name,
          template_data: data.template.data,
        },
        { headers: { "kumbi-api-key": "Bearer " + this.apiKey } },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        throw new Error(
          `Mail failed (status: ${status}): ${JSON.stringify(data)}`,
        );
      }

      throw new Error(`Mail failed: ${String(error)}`);
    }
  }
}
