# 📦 Kumbify SDK

> A simple and powerful JavaScript/TypeScript SDK for sending **emails** and **SMS messages** through the Kumbify platform.

[Oficial Documentation](https://kumbify.com/en/api-docs?section=sdk)

This SDK makes it easy to integrate messaging (email + SMS) into your apps with minimal setup and clear type-safe APIs.

---

###  Installation

Install using npm:

```bash
npm install @kumbify/sdk
```

or using Yarn:

```bash
yarn add @kumbify/sdk
```

###  Importing

```ts
import { KMailClient, KSMSClient } from "@kumbify/sdk";
```


### Email — KMailClient

#### 📍 Create an Email Client

```ts
const mailClient = new KMailClient({
  apiKey: "YOUR_EMAIL_API_KEY",
});
```

### 📤 Send a Simple Email

```ts
const sendMail = await mailClient.sendSimpleMail({
  body_html: "<h1>Hello from Kumbify</h1><p>This is a test email</p>",
  body_text: "Hello from Kumbify — this is a test email.",
  from_address: "no-reply@kumbify.app",
  subject: "Welcome Email",
  to_address: ["recipient@example.com"],
});

console.log("Email Response:", sendMail);
```

**Parameters explained:**

| Property       | Type     | Description                       |
| -------------- | -------- | --------------------------------- |
| `body_html`    | string   | HTML email content                |
| `body_text`    | string   | Plain text email content          |
| `from_address` | string   | Sender email address              |
| `subject`      | string   | Email subject                     |
| `to_address`   | string[] | List of recipient email addresses |

---

### SMS — KSMSClient

#### 📍 Create an SMS Client

```ts
const smsClient = new KSMSClient({
  apiKey: "YOUR_SMS_API_KEY",
});
```

#### 📤 Send an SMS Message

```ts
await smsClient.sendSMS({
  message: "Your verification code is 123456",
  from: "kumbify-app",
  to: "+1234567890",
});

console.log("SMS sent successfully!");
```

**Parameters explained:**

| Property  | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `message` | string | SMS content                          |
| `from`    | string | Sender identifier (visible to users) |
| `to`      | string | Recipient phone number               |

---

###  Example Usage All Together

```ts
import { KMailClient, KSMSClient } from "@kumbify/sdk";

const mailClient = new KMailClient({ apiKey: "EMAIL_KEY" });
const smsClient = new KSMSClient({ apiKey: "SMS_KEY" });

// Send Email
await mailClient.sendSimpleMail({
  body_html: "<p>Hello!</p>",
  body_text: "Hello!",
  from_address: "no-reply@kumbify.com",
  subject: "Test Email",
  to_address: ["user1@example.com"],
});

// Send SMS
await smsClient.sendSMS({
  message: "Your code is 1234",
  from: "KumbifyApp",
  to: "+1234567890",
});
```

---

### Tips & Best Practices

✔️ Store your API keys in environment variables (never hardcode them).
✔️ Always handle promise rejections with `try/catch`.
✔️ Log or inspect response objects to monitor delivery success.

---

### Supported Environments

✔ Node.js
✔ TypeScript
✔ Any JavaScript project that supports npm packages
