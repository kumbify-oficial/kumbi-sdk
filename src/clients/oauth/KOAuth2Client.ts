import { APP_CONFIG } from "../../utils/helpers";
import { fetchRequest } from "../../api/api";
import {
  IOAuthRevokeTokenReponse,
  IOAuthServiceInfoResponse,
  IOAuthUserInfoResponse,
  IOAuthUserTokenReponse,
} from "../../utils/types";
import { EKUMBI_APP_HEADERS } from "../../utils/enums";
import {
  IOAuthClientProps,
  IOAuthClientTokenParams,
  IOAuthVerifyWebhookEvents,
  IProfileConfirmationParams,
  IProfileConfirmationResponse,
  IProfileCreateParams,
  IProfileCreateResponse,
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

  private getAuthHeaders() {
    const headers = {
      [EKUMBI_APP_HEADERS.RAW_APP_KEY]: `Bearer ${this.config.clientSecret}`,
      lang: this.config.api.lang,
    };
    return headers;
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
      const redirectUri =
        data.type == "account"
          ? this.config.redirectUri.account
          : this.config.redirectUri.service;

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
          ...this.getAuthHeaders(),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "oauth" });
    }
  }

  async revokeAccessToken({
    accessToken,
    type,
  }: {
    accessToken: string;
    type: "service" | "account";
  }) {
    try {
      const url = type == "service" ? "integrations" : "me";

      const response: IOAuthRevokeTokenReponse = await fetchRequest({
        url: APP_CONFIG.OAUTH.API_BASE_URL + `/u/${url}/revoke`,
        method: "post",
        body: {
          token: accessToken,
        },
        headers: {
          ...this.getAuthHeaders(),
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
          ...this.getAuthHeaders(),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "oauth" });
    }
  }

  async serviceInfo({ accessToken }: { accessToken: string }) {
    try {
      const response: IOAuthServiceInfoResponse = await fetchRequest({
        url: APP_CONFIG.OAUTH.API_BASE_URL + "/u/integrations/services/me",
        method: "post",
        body: {
          token: accessToken,
        },
        headers: {
          ...this.getAuthHeaders(),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "oauth" });
    }
  }

  async profileCreation(params: IProfileCreateParams) {
    try {
      const response: IProfileCreateResponse = await fetchRequest({
        url: APP_CONFIG.PROFILE.BASE_URL + `/create`,
        method: "post",
        body: {
          ...params,
        },
        headers: {
          [EKUMBI_APP_HEADERS.APP_SECRET]: this.config.clientSecret,
          [EKUMBI_APP_HEADERS.APP_ID]: this.config.clientId,
          ...this.getAuthHeaders(),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "oauth" });
    }
  }

  async profileConfirmation(params: IProfileConfirmationParams) {
    try {
      const response: IProfileConfirmationResponse = await fetchRequest({
        url: APP_CONFIG.PROFILE.BASE_URL + `/confirm-account`,
        method: "post",
        body: {
          token: params.accessToken,
          code: params.code,
        },
        headers: {
          [EKUMBI_APP_HEADERS.APP_SECRET]: this.config.clientSecret,
          [EKUMBI_APP_HEADERS.APP_ID]: this.config.clientId,
          ...this.getAuthHeaders(),
        },
      });

      return response;
    } catch (error) {
      APIError.CatchError({ error, section: "oauth" });
    }
  }

  /**
   * @ WEBHOOK EVENTS
   * Verifies the webhook when the payload sent to the event URLs arrives.
   *
   */
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
