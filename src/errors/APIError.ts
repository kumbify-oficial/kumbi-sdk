import axios from "axios";

class APIError {
  CatchError({
    error,
    section,
  }: {
    error: any;
    section: "mail" | "sms" | "oauth";
  }) {
    let errorSection = "";

    switch (section) {
      case "mail":
        errorSection = "Mail Service: Failed =>";
        break;

      case "oauth":
        errorSection = "OAuthService: Failed =>";
        break;

      case "sms":
        errorSection = "SMS Service: Failed =>";
        break;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      throw new Error(
        `${errorSection} (status: ${status}): ${JSON.stringify(data)}`,
      );
    }

    throw new Error(`${errorSection} ${String(error)}`);
  }
}

export default new APIError();
