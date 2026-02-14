import { APP_CONFIG } from "@/utils/helpers";
import { IKSMSSendMessage } from "@/utils/types";
import axios from "axios";

export class KSMSServer {
  apiKey;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  async sendSMS({ message, from, to }: IKSMSSendMessage) {
    try {
      const response = await axios.post(
        APP_CONFIG.KSMS_URL + "/send",
        {
          body: message,
          to,
          from,
        },
        { headers: { "kumbi-api-key": "Bearer " + this.apiKey } },
      );

      return response.data;
    } catch (error) {
      throw new Error("Failed while send sms: ", error);
    }
  }
}
