import { APP_CONFIG } from "../utils/helpers";
import { IKSMSSendMessage } from "../utils/types";
import axios from "axios";

export class KSMSClient {
  private apiKey;

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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        throw new Error(
          `SMS failed (status: ${status}): ${JSON.stringify(data)}`,
        );
      }

      throw new Error(`SMS failed: ${String(error)}`);
    }
  }
}
