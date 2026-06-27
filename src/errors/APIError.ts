import axios from "axios";

class APIError {
  SectionMessage(section: string) {
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

      case "payment":
        errorSection = "Payment Service: Failed =>";
        break;
    }

    return errorSection;
  }

  CatchError({
    error,
    section,
  }: {
    error: any;
    section: "mail" | "sms" | "oauth" | "payment";
  }) {
    let errorSection = this.SectionMessage(section);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      throw new Error(
        `${errorSection} (status: ${status}): ${JSON.stringify(data)}`,
      );
    }

    throw new Error(`${errorSection} ${String(error)}`);
  }

  ErrorMessage({
    section,
    message,
  }: {
    section: "mail" | "sms" | "oauth" | "payment";
    message?: string;
  }) {
    let errorSection = this.SectionMessage(section);
    throw new Error(`${errorSection} ${message}`);
  }
}

export default new APIError();
