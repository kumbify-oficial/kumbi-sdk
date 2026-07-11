/**
 * Global Types
 */

export interface IAPIConfig {
  lang?: "pt" | "en";
  version?: "v1";
}

/**
 * KMAIL Types
 */

export type IKMailSendMailSimpleMessage = {
  from: string;
  to: string[];
  subject: string;
  body: {
    html: string;
    text: string;
  };
};

export type IKMailSendMailTemplateMessage = {
  from: string;
  to: string[];
  template: {
    name: string;
    data: Record<string, any>;
  };
};

export type IKMailResponseMail = {
  success: boolean;
  messageId: string;
};

/**
 * KSMS Types
 */

export type IKSMSSendMessage = {
  message: string;
  to: string[];
  from: string;
};

export type IKSMSResponseMessage = {
  success: boolean;
  messageId: string;
};

/**
 * OAuth Types
 */

export type IOAuthUserTokenReponse = {
  success: boolean;
  access_token: string;
  refresh_token: string;
};

export type IOAuthUserInfoResponse = {
  success: boolean;
  user: {
    first_name: string;
    last_name: string;
    photo: string;
    email?: string;
    phone?: string;
    kumbi_code: string;
  };
};

export type IOAuthServiceInfoResponse = {
  success: boolean;
  service: {
    name: string;
    platform: string;
    integration: {
      code: string;
      name: string;
    };
  };
};
