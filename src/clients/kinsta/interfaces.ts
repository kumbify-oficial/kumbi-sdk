import { IAPIConfig } from "../../utils/types";

export interface IKInstagramParams {
  clientId: string;
  clientSecret: string;
  api?: IAPIConfig;
}

export interface IKInstagramMessageParams {
  action: "messages" | "comments";
  accountId: string;
  accessToken: string;
  from: {
    id: string;
  };
  message?: {
    text: string;
    action: "reply-comment" | "message";
  };
  comment?: {
    id: string;
    text: string;
  };
}

export interface IKInstagramMessageResponse {
  success: boolean;
}

export interface IKInstagramPublishContentParams {
  accessToken: string;
  media: {
    fileBuffer: Buffer;
    caption?: string;
  };
}

export interface IKInstagramPublishContentResponse {
  success: boolean;
}
