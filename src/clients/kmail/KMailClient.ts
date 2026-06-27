import {
  IAPIConfig,
  IKMailResponseMail,
  IKMailSendMailSimpleMessage,
  IKMailSendMailTemplateMessage,
} from "../../utils/types";
import { APP_CONFIG } from "../../utils/helpers";
import { fetchRequest } from "../../api/api";

import APIError from "../../errors/APIError";

interface IKMailParams {
  apiKey: string;
  api?: IAPIConfig;
}

export class KMailClient {
  private config: IKMailParams = {
    apiKey: "",
    api: {
      lang: "pt",
      version: "v1",
    },
  };

  constructor({ ...data }: IKMailParams) {
    this.config = data;
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
          "kumbi-api-key": "Bearer " + this.config.apiKey,
          "accept-language": this.config.api.lang,
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
          "kumbi-api-key": "Bearer " + this.config.apiKey,
          "accept-language": this.config.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "mail" });
    }
  }
}
