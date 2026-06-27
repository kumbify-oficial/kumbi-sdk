import { IAPIConfig } from "../../utils/types";

type EAngolanPaymentProviders = "paypay";
type EInternationalPaymentProviders = "stripe" | "crypto";

export interface IPaymentParams {
  api?: IAPIConfig;
  apiKey: string;
  provider: {
    angolan?: {
      seller: EAngolanPaymentProviders;
    };
    international?: {
      seller: EInternationalPaymentProviders;
    };
    type: "angolan" | "international";
  };
}

export interface IMakeAngolanPaymentParams {
  amount: number;
  subject: string;
  method: "reference" | "multicaixa";
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
  product: IProduct[];
  redirect: {
    success_url?: string;
    cancel_url?: string;
  };
  currency: StripeCurrencies;
}

export interface IMakeStripePaymentResponse {
  url: string;
}

/**
 * Crypto types
 */

type CryptoCurrencies = "USDC" | "ETH" | "BTC" | "USDT";
export interface IMakeCryptoPaymentParams {
  transactionId: string;
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  products: IProduct[];
  currency: CryptoCurrencies;
}

export interface IMakeCryptoPaymentResponse {
  address: string;
}
