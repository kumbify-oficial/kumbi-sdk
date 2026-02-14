export type IKMailSendMailSimpleMessage = {
  from_address: string;
  to_address: string[];
  subject: string;
  body_html: string;
  body_text: string;
};

export type IKMailSendMailTemplateMessage = {
  from_address: string;
  to_address: string[];
  template_name: string;
  template_data: Record<string, any>;
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
