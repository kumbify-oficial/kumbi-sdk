import { fetchRequest } from "../../api/api";
import { APP_CONFIG, detectFileType } from "../../utils/helpers";

import {
  IKwabaGenerateQRCodeResponse,
  IKwabaParams,
  IKWabaSendMessageParams,
  IKWabaSendMessageResponse,
} from "./interfaces";

import FormData from "form-data";
import APIError from "../../errors/APIError";

export class KWabaClient {
  private config: IKwabaParams = {
    apiKey: "",
    clientId: "",
    clientSecret: "",
    api: {
      lang: "pt",
      version: "v1",
    },
  };

  constructor({ ...data }: IKwabaParams) {
    this.config = {
      ...this.config,
      ...data,
    };
  }

  async generateQRCode() {
    try {
      const response: IKwabaGenerateQRCodeResponse = await fetchRequest({
        url: `${APP_CONFIG.KWABA_URL}/waba/qrcode`,
        method: "get",
        headers: {
          "kumbi-api-key": `Bearer ${this.config.apiKey}`,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error: error, section: "kwaba" });
    }
  }

  async sendMessageDirect(params: IKWabaSendMessageParams) {
    try {
      let response: IKWabaSendMessageResponse;

      if (params.direct.type == "text") {
        response = await fetchRequest({
          url: `${APP_CONFIG.KWABA_URL}/app/waba/send/text`,
          method: "post",
          body: {
            to: params.to,
            message: params?.text?.content,
            session: params.direct.sessionId,
            clientSecret: this.config.clientSecret,
            clientId: this.config.clientId,
            requestId: params.requestId,
          },
          headers: {
            "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          },
        });
      }

      if (params.direct.type == "media") {
        const formData = new FormData();
        formData.append("to", params.to);
        formData.append("type", params.media.type);
        formData.append("session", params.direct.sessionId);
        formData.append("caption", params.media.caption);
        formData.append("requestId", params.requestId);
        formData.append("clientId", this.config.clientId);
        formData.append("clientSecret", this.config.clientSecret);

        if (params.media.fileBuffer) {
          const fileType = await detectFileType(params.media.fileBuffer);
          const fileName = `${params.media.fileName}.${fileType.ext}`;
          formData.append("media", params.media?.fileBuffer, {
            filename: fileName,
            contentType: fileType.mime,
          });
        }

        response = await fetchRequest({
          url: `${APP_CONFIG.KWABA_URL}/app/waba/send/media`,
          method: "post-form",
          body: formData,
          headers: {
            "kumbi-api-key": `Bearer ${this.config.apiKey}`,
            ...formData.getHeaders(),
          },
        });
      }

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "kwaba" });
    }
  }

  async sendMessageOficial(params: IKWabaSendMessageParams) {
    try {
      let response: IKWabaSendMessageResponse;

      if (params.official.type == "text") {
        response = await fetchRequest({
          url: `${APP_CONFIG.KWABA_URL}/app/oficial/send/text`,
          method: "post",
          body: {
            to: params.to,
            message: params?.text?.content,
            type: params.official.type,
            clientSecret: this.config.clientSecret,
            clientId: this.config.clientId,
            requestId: params.requestId,
          },
          headers: {
            "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          },
        });
      }

      if (params.official.type == "template") {
        response = await fetchRequest({
          url: `${APP_CONFIG.KWABA_URL}/app/oficial/send/text`,
          method: "post",
          body: {
            to: params.to,
            message: params?.text?.content,
            template_name: params.official.templateName,
            type: params.official.type,
            clientSecret: this.config.clientSecret,
            clientId: this.config.clientId,
            requestId: params.requestId,
          },
          headers: {
            "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          },
        });
      }

      if (params.official.type == "media") {
        const formData = new FormData();
        formData.append("to", params.to);
        formData.append("type", params.media.type);
        formData.append("requestId", params.requestId);
        formData.append("clientId", this.config.clientId);
        formData.append("clientSecret", this.config.clientSecret);

        if (params.media.fileBuffer) {
          const fileType = await detectFileType(params.media.fileBuffer);
          const fileName = `${params.media.fileName}.${fileType.ext}`;
          formData.append("media", params.media?.fileBuffer, {
            filename: fileName,
            contentType: fileType.mime,
          });
        }

        response = await fetchRequest({
          url: `${APP_CONFIG.KWABA_URL}/app/oficial/send/media`,
          method: "post-form",
          body: formData,
          headers: {
            "kumbi-api-key": `Bearer ${this.config.apiKey}`,
          },
        });
      }

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "kwaba" });
    }
  }
}
