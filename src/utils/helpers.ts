import filetypeinfo from "magic-bytes.js";

export const APP_CONFIG = {
  KSMS_URL: "https://oi.kumbify.com/api/sms",
  KMAIL_URL: "https://oi.kumbify.com/api/email",
  KWABA_URL: "https://wa.kumbify.com/api",
  KFB_URL: "https://oi.kumbify.com/api/social/facebook",
  KINSTA_URL: "https://oi.kumbify.com/api/social/instagram",
  OAUTH: {
    API_BASE_URL: "https://8n8.kumbify.com/api",
  },
  PAYMENT: {
    API_BASE_URL: "https://oi.kumbify.com/api/pay",
  },
};

export async function streamToBufferTradicional(stream: any) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function detectFileType(file: Buffer) {
  const uint8Array = new Uint8Array(file);
  const files = filetypeinfo(uint8Array);

  if (files.length === 0) {
    return null;
  }

  return {
    ext: files[0].extension,
    mime: files[0].mime,
  };
}
