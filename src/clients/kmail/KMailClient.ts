import {
  IAPIConfig,
  IKMailResponseMail,
  IKMailSendMailSimpleMessage,
  IKMailSendMailTemplateMessage,
} from "../../utils/types";
import { APP_CONFIG } from "../../utils/helpers";
import { fetchRequest } from "../../api/api";
import { EKUMBI_APP_HEADERS } from "../../utils/enums";

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

  constructor({ api, ...rest }: IKMailParams) {
    this.config = {
      ...this.config,
      ...rest,
      api: {
        ...this.config.api,
        ...api,
      },
    };
  }

  private getAuthHeaders() {
    const headers = {
      [EKUMBI_APP_HEADERS.RAW_API_KEY]: "Bearer " + this.config.apiKey,
      lang: this.config.api.lang,
    };
    return headers;
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
          ...this.getAuthHeaders(),
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
          ...this.getAuthHeaders(),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "mail" });
    }
  }
}
