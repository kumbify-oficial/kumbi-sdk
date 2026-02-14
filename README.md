# 📦 Kumbify SDK

> A simple and powerful JavaScript/TypeScript SDK for sending **emails** and **SMS messages** through the Kumbify platform.

[Oficial Documentation](https://kumbify.com/en/api-docs?section=sdk)

This SDK makes it easy to integrate messaging (email + SMS) into your apps with minimal setup and clear type-safe APIs.

---

### Installation

Install using npm:

```bash
npm install @kumbify/sdk
```

or using Yarn:

```bash
yarn add @kumbify/sdk
```

### Importing

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

```ts
// 📤 Send a Simple Email
const sendMail = await mailClient.sendSimpleMail({
  from: "no-reply@kumbify.com",
  subject: "Welcome Email",
  to: ["user1@example.com"],
  body: {
    html: "<h1>Hello from Kumbify</h1><p>This is a test email</p>",
    text: "Hello from Kumbify — this is a test email.",
  },
});

console.log("Email Response: ", sendMail);
```

**Parameters explained:**

| Property       | Type     | Description                       |
| -------------- | -------- | --------------------------------- |
| `body.html`    | string   | HTML email content                |
| `body.text`    | string   | Plain text email content          |
| `from` | string   | Sender email address              |
| `subject`      | string   | Email subject                     |
| `to`   | string[] | List of recipient email addresses |

---

```ts
// 📤 Send a Template Email
const sendMail = await mailClient.sendTemplateMail({
  from: "app@example.com",
  to: ["user@example.com"],
  template: {
    name: "my-template-name",
    data: {
      customer: {
        name: "Ricardo Castle",
        email: "doe@gmail.com"
      }
    },
  },
});

console.log("Email Response: ", sendMail);

```

**Parameters explained:**

| Property        | Type     | Description                                                              |
| --------------- | -------- | ------------------------------------------------------------------------ |
| `from`          | string   | Sender email address. Must be a verified domain in your Kumbify account. |
| `to`            | string[] | List of recipient email addresses.                                       |
| `template.name` | string   | Name of the template created in your Kumbify dashboard.                  |
| `template.data` | object   | Dynamic data that will be injected into the template.                    |

---

### SMS — KSMSClient

#### 📍 Create an SMS Client

```ts
const smsClient = new KSMSClient({
  apiKey: "YOUR_SMS_API_KEY",
});
```

```ts
// 📤 Send an SMS Message
await smsClient.sendSMS({
  message: "Your verification code is 123456",
  from: "kumbify-app",
  to: ["+1234567890"],
});

console.log("SMS sent successfully!");
```

**Parameters explained:**

| Property  | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `message` | string | SMS content                          |
| `from`    | string | Sender identifier (visible to users) |
| `to`      | string | List of recipient phone numbers               |
---

### Example Usage All Together

```ts
import { KMailClient, KSMSClient } from "@kumbify/sdk";

const mailClient = new KMailClient({ apiKey: "EMAIL_KEY" });
const smsClient = new KSMSClient({ apiKey: "SMS_KEY" });

// Send Email
await mailClient.sendSimpleMail({
  from: "no-reply@kumbify.com",
  subject: "Test Email",
  to: ["user1@example.com"],
  body: {
    html: "<p>Hello!</p>",
    text: "Hello!",
  },
});

// Send SMS
await smsClient.sendSMS({
  message: "Your code is 1234",
  from: "KumbifyApp",
  to: ["+1234567890"],
});
```

---

### Tips & Best Practices

- Store your API keys in environment variables (never hardcode them).
- Always handle promise rejections with `try/catch`.
- Log or inspect response objects to monitor delivery success.

---

### Supported Environments

- Node.js
- TypeScript
- Any JavaScript project that supports npm packages
