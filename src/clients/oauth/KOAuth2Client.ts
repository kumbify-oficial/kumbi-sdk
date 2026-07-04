import { APP_CONFIG } from "../../utils/helpers";
import { fetchRequest } from "../../api/api";
import {
  IAPIConfig,
  IOAuthUserInfoResponse,
  IOAuthUserTokenReponse,
} from "../../utils/types";

import APIError from "../../errors/APIError";

interface IOAuthClientTokenParams {
  type: "services" | "account";
  code: string;
  grant_type: "authorization_code" | "refresh_token";
  refresh_token?: string;
  redirect?: IOAuthRedirect;
  expires_in: "1h" | "1d" | "7d" | "never";
}

interface IOAuthRedirect {
  account?: string;
  service?: string;
}

interface IOAuthScopes {
  account?: OAuthAccountScopes[];
  service?: OAuthServiceScopes[];
}

interface IOAuthClientProps {
  clientId: string;
  clientSecret: string;
  scopes: IOAuthScopes;
  redirectUri: IOAuthRedirect;
  api?: IAPIConfig;
}

type OAuthServiceScopes = "gmail.send.email" | "";
type OAuthAccountScopes = "profile" | "subscription.read" | "";

export class KOAuth2Client {
  private api: IAPIConfig = { lang: "pt", version: "v1" };
  private config: IOAuthClientProps = {
    clientId: "",
    clientSecret: "",
    redirectUri: { account: "", service: "" },
    scopes: {
      account: [""],
      service: [""],
    },
    api: {
      lang: "pt",
      version: "v1",
    },
  };

  constructor({ api, redirectUri, scopes, ...rest }: IOAuthClientProps) {
    this.config = {
      ...this.config,
      ...rest,
      scopes: {
        ...this.config.scopes,
        ...scopes,
      },
      redirectUri: {
        ...this.config.redirectUri,
        ...redirectUri,
      },
      api: {
        ...this.config.api,
        ...api,
      },
    };
  }

  generateOAuthAccountUrl({ state }: { state?: string }) {
    const url = `https://kumbify.com/${this.api.lang}/oauth?client_id=${
      this.config.clientId
    }&scopes=${this.config.scopes.account.join(",")}${
      state ? `&state=${state}` : ""
    }&redirect=${this.config.redirectUri.account}`;

    return { url };
  }

  generateOAuthServiceUrl({ state }: { state?: string }) {
    const url = `https://kumbify.com/${
      this.api.lang
    }/oauth/services?client_id=${
      this.config.clientId
    }&scopes=${this.config.scopes.service.join(",")}${
      state ? `&state=${state}` : ""
    }&redirect=${this.config.redirectUri.service}`;

    return { url };
  }

  async generateToken({ ...data }: IOAuthClientTokenParams) {
    try {
      const redirectUri = data.redirect
        ? data.type == "account"
          ? data.redirect.account
          : data.redirect.service
        : "";

      const response: IOAuthUserTokenReponse = await fetchRequest({
        url: APP_CONFIG.OAUTH.API_BASE_URL + "/u/tokens/generate",
        method: "post",
        body: {
          code: data.code,
          grant_type: data.grant_type,
          refresh_token: data.refresh_token,
          client_id: this.config.clientId,
          redirect_uri: redirectUri,
          expires_in: data.expires_in,
        },
        headers: {
          "kumbi-app-key": `Bearer ${this.config.clientSecret}`,
          lang: this.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "oauth" });
    }
  }

  async userInfo({ accessToken }: { accessToken: string }) {
    try {
      const response: IOAuthUserInfoResponse = await fetchRequest({
        url: APP_CONFIG.OAUTH.API_BASE_URL + "/u/me",
        method: "post",
        body: {
          token: accessToken,
        },
        headers: {
          "kumbi-app-key": `Bearer ${this.config.clientSecret}`,
          lang: this.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "oauth" });
    }
  }
}
