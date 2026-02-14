import { AxiosError } from "axios";
import { APP_CONFIG } from "../utils/helpers";
import { IKSMSSendMessage } from "../utils/types";
import axios from "axios";

export class KSMSClient {
  apiKey;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  async sendSMS({ ...data }: IKSMSSendMessage) {
    try {
      const response = await axios.post(
        APP_CONFIG.KSMS_URL + "/send",
        {
          body: data.message,
          to: data.to,
          from: data.from,
        },
        { headers: { "kumbi-api-key": "Bearer " + this.apiKey } },
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Message: " + error.response.data);
      }
      throw new Error("Failed while send sms: ", error);
    }
  }
}
