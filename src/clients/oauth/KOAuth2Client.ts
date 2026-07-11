import { APP_CONFIG } from "../../utils/helpers";
import { fetchRequest } from "../../api/api";
import {
  IOAuthUserInfoResponse,
  IOAuthUserTokenReponse,
} from "../../utils/types";
import {
  IOAuthClientProps,
  IOAuthClientTokenParams,
  IOAuthVerifyWebhookEvents,
} from "./interfaces";
import crypto from "crypto";

import APIError from "../../errors/APIError";

export class KOAuth2Client {
  private config: IOAuthClientProps = {
    clientId: "",
    clientSecret: "",
    redirectUri: { account: "", service: "" },
    scopes: {
      account: [],
      service: {
        scopes: [],
        platform: "",
      },
    },
    api: {
      lang: "pt",
      version: "v1",
    },
  };

  constructor({
    api = {},
    redirectUri,
    scopes: { account = [], service = { platform: "", scopes: [] } } = {},
    ...rest
  }: IOAuthClientProps) {
    this.config = {
      ...this.config,
      ...rest,
      scopes: {
        ...this.config.scopes,
        account: [...(this.config.scopes?.account ?? []), ...account],
        service: {
          ...this.config.scopes?.service,
          ...service,
        },
      },
      redirectUri: redirectUri ?? this.config.redirectUri,
      api: {
        ...this.config.api,
        ...api,
      },
    };
  }

  generateOAuthAccountUrl({ state }: { state?: string }) {
    const url = `https://kumbify.com/${this.config.api.lang}/oauth?client_id=${
      this.config.clientId
    }&scopes=${this.config.scopes.account.join(",")}${
      state ? `&state=${state}` : ""
    }&redirect=${this.config.redirectUri.account}`;

    return { url };
  }

  generateOAuthServiceUrl({ state }: { state?: string }) {
    const url = `https://kumbify.com/${
      this.config.api.lang
    }/oauth/services?client_id=${
      this.config.clientId
    }&scopes=${this.config.scopes.service.scopes.join(",")}${
      state ? `&state=${state}` : ""
    }&service=${this.config.scopes.service.platform}&redirect=${
      this.config.redirectUri.service
    }`;

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
          lang: this.config.api.lang,
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
          lang: this.config.api.lang,
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "oauth" });
    }
  }

  verifyWebhookEvent(params: IOAuthVerifyWebhookEvents) {
    try {
      const signature = params.req.headers["X-Hub-Signature-256"] as string;

      if (!signature) {
        APIError.CatchError({ error: "Invalid signature", section: "oauth" });
      }

      const expectedHash = crypto
        .createHmac("sha256", this.config.clientSecret)
        .update(JSON.stringify(params.req.rawBody))
        .digest("hex");

      const checksum = Buffer.from(signature, "utf8");
      const expectedChecksum = Buffer.from(expectedHash, "utf8");

      if (
        checksum.length === expectedChecksum.length &&
        crypto.timingSafeEqual(checksum, expectedChecksum)
      ) {
        return true;
      } else {
        APIError.CatchError({ error: "Invalid signature", section: "oauth" });
      }
    } catch (error) {
      APIError.CatchError({
        error: "Error while check signature",
        section: "oauth",
      });
    }
  }
}
