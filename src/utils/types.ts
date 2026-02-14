export type IKMailSendMailSimpleMessage = {
  from: string;
  to: string[];
  subject: string;
  body_html: string;
  body_text: string;
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
};

export type IKSMSSendMessage = {
  message: string;
  to: string[];
  from: string;
};

export type IKSMSResponseMessage = {
  success: boolean;
};
