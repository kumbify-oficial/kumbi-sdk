import {
  IAPIConfig,
  IKMailResponseMail,
  IKMailSendMailSimpleMessage,
  IKMailSendMailTemplateMessage,
} from "../utils/types";
import { APP_CONFIG } from "../utils/helpers";
import { fetchRequest } from "../api/api";

import APIError from "../errors/APIError";

export class KMailClient {
  private apiKey;
  private api: IAPIConfig = { lang: "pt", version: "v1" };

  constructor({ apiKey, api }: { apiKey: string; api?: IAPIConfig }) {
    this.apiKey = apiKey;
    this.api = api;
  }

  async sendSimpleMail({ ...data }: IKMailSendMailSimpleMessage) {
    try {
      const response: IKMailResponseMail = await fetchRequest({
        url: APP_CONFIG.KMAIL_URL + "/send",
        method: "post",
        body: {
          from_address: data.from,
          to_address: data.to,
          subject: data.subject,
          body_html: data.body.html,
          body_text: data.body.text,
        },
        headers: {
          "kumbi-api-key": "Bearer " + this.apiKey,
          "accept-language": this.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "mail" });
    }
  }

  async sendTemplateMail({ ...data }: IKMailSendMailTemplateMessage) {
    try {
      const response: IKMailResponseMail = await fetchRequest({
        url: APP_CONFIG.KMAIL_URL + "/send",
        method: "post",
        body: {
          from_address: data.from,
          to_address: data.to,
          template_name: data.template.name,
          template_data: data.template.data,
        },
        headers: {
          "kumbi-api-key": "Bearer " + this.apiKey,
          "accept-language": this.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "mail" });
    }
  }
}
