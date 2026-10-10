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

export type IOAuthRevokeTokenReponse = {
  success: boolean;
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

export type IOAuthUserSubscriptionResponse = {
  currency: "AOA" | "USD" | string;
  amount: number;
  is_expired: boolean;
  expires_at: string;
  plan: {
    name: string;
  };
  one: {
    crm: {
      atendabots: number;
      atendatools: number;
      channels: number;
      inboxes: number;
      messages: number;
      members: number;
      storage: number;
    };
    forms: {
      branding: number;
      responses: number;
      storage: number;
      upload: number;
      forms: number;
    };
    sonet: {
      branding: boolean;
      upload: boolean;
      metrics: boolean;
      links: number;
      mediakit: boolean;
      storage: number;
    };
  };
  features: {
    automations: number;
    integrations: number;
    automations_used: number;
    integrations_used: number;
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
      waba?: {
        phone_id?: string;
        phone_number?: string;
      };
    };
  };
};
