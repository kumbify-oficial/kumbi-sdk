import { IAPIConfig } from "../../utils/types";

export interface IKwabaParams {
  apiKey: string;
  api?: IAPIConfig;
}

export interface IKwabaGenerateQRCodeResponse {
  session: string;
  qrcode: string;
}

export interface IKWabaSendMessageParams {
  to: string;
  media?: {
    type: "video" | "audio" | "document" | "image";
    caption?: string;
    fileBuffer: Buffer;
    fileName: string;
  };
  text?: {
    content?: string;
  };
  direct?: {
    type: "text" | "media";
    sessionId?: string;
  };
  official?: {
    templateName?: string;
    type: "text" | "media" | "template";
  };
}

export interface IKWabaSendMessageResponse {
  success: boolean;
}
