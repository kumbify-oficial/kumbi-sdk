import { IAPIConfig } from "../../utils/types";

export interface IOAuthClientTokenParams {
  type: "services" | "account";
  code: string;
  grant_type: "authorization_code" | "refresh_token";
  refresh_token?: string;
  redirect?: IOAuthRedirect;
  expires_in: "1h" | "1d" | "7d" | "never";
}

export interface IOAuthVerifyWebhookEvents {
  req: {
    headers: Record<string, any>;
    rawBody: any;
  };
}

export interface IOAuthRedirect {
  account?: string;
  service?: string;
}

export interface IOAuthScopes {
  account?: OAuthAccountScopes[];
  service?: { scopes: OAuthServiceScopes[]; platform: OAuthServicePlatform };
}

export interface IOAuthClientProps {
  clientId: string;
  clientSecret: string;
  scopes: IOAuthScopes;
  redirectUri: IOAuthRedirect;
  api?: IAPIConfig;
}

export type OAuthServicePlatform =
  | "waba-oficial"
  | "facebook-pages"
  | "instagram"
  | "gmail"
  | "gsheets"
  | "gcalendar"
  | "trello"
  | "asana"
  | "";

export type OAuthServiceScopes =
  | "gmail.send.email"
  | "instagram.publish"
  | "instagram.comment"
  | "instagram.message"
  | "facebook-pages.publish"
  | "facebook-pages.comment"
  | "facebook-pages.message"
  | "facebook-pages.showlist"
  | "whatsapp.message";

export type OAuthAccountScopes = "profile" | "subscription.read" | "";
