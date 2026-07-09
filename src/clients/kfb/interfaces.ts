import { IAPIConfig } from "../../utils/types";

export interface IKFacebookParams {
  clientId: string;
  clientSecret: string;
  api?: IAPIConfig;
}

export interface IKFacebookShowListResponse {
  success: boolean;
  pages: {
    name: string;
    id: string;
  }[];
}

export interface IFacebookShowListPageParams {
  accessToken: string;
}

export interface IKFacebookMessageParams {
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

export interface IKFacebookMessageResponse {
  success: boolean;
}

export interface IKFacebookPublishContentParams {
  type: "media" | "text";
  accountId: string;
  accessToken: string;
  media?: {
    fileBuffer: Buffer;
    caption?: string;
  };
  text?: {
    content: string;
  };
}

export interface IKFacebookPublishContentResponse {
  success: boolean;
}
