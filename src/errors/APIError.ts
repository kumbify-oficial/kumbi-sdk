import axios from "axios";

type sectionType =
  | "mail"
  | "sms"
  | "oauth"
  | "payment"
  | "kwaba"
  | "kfb"
  | "kinsta";

class APIError {
  SectionMessage(section: sectionType) {
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
      case "kfb":
        errorSection = "Facebook Service: Failed =>";
        break;
      case "kwaba":
        errorSection = "Waba Service: Failed =>";
        break;
      case "kinsta":
        errorSection = "Instagram Service: Failed =>";
        break;
    }

    return errorSection;
  }

  CatchError({ error, section }: { error: any; section: sectionType }) {
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
    section: sectionType;
    message?: string;
  }) {
    let errorSection = this.SectionMessage(section);
    throw new Error(`${errorSection} ${message}`);
  }

  LangMessage({ en, pt, lang }: { pt: string; en: string; lang: string }) {
    return lang == "pt" ? pt : en;
  }
}

export default new APIError();
