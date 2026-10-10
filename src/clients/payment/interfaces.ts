import { IAPIConfig } from "../../utils/types";

type EAngolanPaymentProviders = "paypay";

export interface IPaymentParams {
  api?: IAPIConfig;
  apiKey: string;
}

export interface IMakeAngolanPaymentParams {
  amount: number;
  subject: string;
  method: "reference" | "multicaixa" | "paypay";
  provider: EAngolanPaymentProviders;
  transfer?: {
    iban: string;
    owner_name: string;
  };
  payment?: {
    customer?: {
      phone: string;
    };
  };
  transaction: {
    id: string;
    type: "payment" | "transfer";
  };
}

export interface IMakeAngolanPaymentResponse {
  transactionId: string;
  trade: {
    entity?: string;
    reference?: number;
    link?: string;
    timestamp: string;
    status: "pending" | "success" | "failed";
  };
}

export interface IProduct {
  amount: number;
  name?: string;
  description?: string;
  quantity: number;
}

/**
 * Stripe Types
 */
export type StripeCurrencies = "USD" | "EUR";
export interface IMakeStripePaymentParams {
  transactionId: string;
  customer: {
    email: string;
    name: string;
  };
  products: IProduct[];
  redirect: {
    success_url?: string;
    cancel_url?: string;
  };
  stripeCurrency: StripeCurrencies;
}

export interface IMakeStripePaymentResponse {
  success: boolean;
  url: string;
}

/**
 * Crypto types
 */

type CryptoCurrencies = "USDC" | "ETH" | "BTC" | "USDT";
export interface IMakeCryptoPaymentParams {
  transactionId: string;
  customer: {
    email?: string;
    name?: string;
    phone?: string;
  };
  products: IProduct[];
  cryptoCurrency: CryptoCurrencies;
}

export interface IMakeCryptoPaymentResponse {
  success: boolean;
  address: string;
  checkoutLink: string;
}
