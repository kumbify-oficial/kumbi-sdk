import { fetchRequest } from "../../api/api";
import { APP_CONFIG, detectFileType } from "../../utils/helpers";
import {
  IFacebookShowListPageParams,
  IKFacebookMessageParams,
  IKFacebookMessageResponse,
  IKFacebookParams,
  IKFacebookPublishContentParams,
  IKFacebookPublishContentResponse,
  IKFacebookShowListResponse,
} from "./interfaces";
import { EKUMBI_APP_HEADERS } from "../../utils/enums";

import FormData from "form-data";
import APIError from "../../errors/APIError";

export class KFacebookClient {
  private config: IKFacebookParams = {
    clientId: "",
    clientSecret: "",
    api: {
      lang: "pt",
      version: "v1",
    },
  };

  constructor({ ...data }: IKFacebookParams) {
    this.config = {
      ...this.config,
      ...data,
    };
  }

  private getAuthHeaders({ accessToken }: { accessToken: string }) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      [EKUMBI_APP_HEADERS.APP_ID]: this.config.clientId,
      [EKUMBI_APP_HEADERS.APP_SECRET]: this.config.clientSecret,
      lang: this.config.api.lang,
    };
    return headers;
  }

  async listPages(params: IFacebookShowListPageParams) {
    try {
      const response: IKFacebookShowListResponse = await fetchRequest({
        url: `${APP_CONFIG.KFB_URL}/pages`,
        method: "get",
        headers: {
          ...this.getAuthHeaders({ accessToken: params.accessToken }),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "kfb" });
    }
  }

  async sendMessage(params: IKFacebookMessageParams) {
    try {
      const response: IKFacebookMessageResponse = await fetchRequest({
        url: `${APP_CONFIG.KFB_URL}/pages/posts`,
        method: "post",
        body: {
          action: params.action,
          fromId: params.from.id,
          accountId: params.accountId,
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
      APIError.CatchError({ error, section: "kfb" });
    }
  }

  async publishContent(params: IKFacebookPublishContentParams) {
    try {
      let response: IKFacebookPublishContentResponse;

      if (params.type == "text") {
        response = await fetchRequest({
          url: `${APP_CONFIG.KFB_URL}/pages/publish/text`,
          method: "post",
          body: {
            accountId: params.accountId,
            description: params.text.content,
          },
          headers: {
            ...this.getAuthHeaders({ accessToken: params.accessToken }),
          },
        });
      }

      if (params.type == "media") {
        const formData = new FormData();

        if (params.media.fileBuffer) {
          const fileType = await detectFileType(params.media.fileBuffer);
          const fileName = `${crypto.randomUUID()}.${fileType.ext}`;

          formData.append("media", params.media?.fileBuffer, {
            filename: fileName,
            contentType: fileType.mime,
          });
        }

        response = await fetchRequest({
          url: `${APP_CONFIG.KFB_URL}/pages/publish/media`,
          method: "post-form",
          body: formData,
          headers: {
            ...this.getAuthHeaders({ accessToken: params.accessToken }),
          },
        });
      }

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "kfb" });
    }
  }
}
