import { fetchRequest } from "../../api/api";
import { APP_CONFIG, detectFileType } from "../../utils/helpers";
import {
  IKInstagramMessageParams,
  IKInstagramMessageResponse,
  IKInstagramParams,
  IKInstagramPublishContentParams,
  IKInstagramPublishContentResponse,
} from "./interfaces";

import FormData from "form-data";
import APIError from "../../errors/APIError";

export class KInstagramClient {
  private config: IKInstagramParams = {
    clientId: "",
    clientSecret: "",
    api: {
      lang: "pt",
      version: "v1",
    },
  };

  constructor({ ...data }: IKInstagramParams) {
    this.config = {
      ...this.config,
      ...data,
    };
  }

  private getAuthHeaders({ accessToken }: { accessToken: string }) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "kumbi-app-id": this.config.clientId,
      "kumbi-app-secret": this.config.clientSecret,
      lang: this.config.api.lang,
    };
    return headers;
  }

  async sendMessage(params: IKInstagramMessageParams) {
    try {
      const response: IKInstagramMessageResponse = await fetchRequest({
        url: `${APP_CONFIG.KINSTA_URL}/posts`,
        method: "post",
        body: {
          action: params.action,
          fromId: params.from.id,
          message: params.message,
          comment: params.comment,
          requestId: params.requestId,
        },
        headers: {
          ...this.getAuthHeaders({ accessToken: params.accessToken }),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "kinsta" });
    }
  }

  async publishContent(params: IKInstagramPublishContentParams) {
    try {
      const formData = new FormData();
      formData.append("caption", params.media.caption);

      if (params.media.fileBuffer) {
        const fileType = await detectFileType(params.media.fileBuffer);
        const fileName = `${crypto.randomUUID()}.${fileType.ext}`;

        formData.append("media", params.media?.fileBuffer, {
          filename: fileName,
          contentType: fileType.mime,
        });
      }

      let response: IKInstagramPublishContentResponse = await fetchRequest({
        url: `${APP_CONFIG.KINSTA_URL}/publish/media`,
        method: "post-form",
        body: formData,
        headers: {
          ...this.getAuthHeaders({ accessToken: params.accessToken }),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "kinsta" });
    }
  }
}
