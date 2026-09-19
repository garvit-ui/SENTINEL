export const FAILURE_ENTRIES = [
  {
    slug: "razorpay-webhook-raw-body",
    provider: "razorpay",
    category: "payments",
    severity: "critical",
    title: "Webhook signature verification fails after body parsing",
    what:
      "Razorpay computes the HMAC-SHA256 signature over the exact raw bytes it sends. If your framework parses the body to JSON before verification — or you re-serialize it with JSON.stringify — the digest changes and verification fails. The webhook still arrives with a 200 expectation, so orders silently never update.",
    detect:
      "Verify the signature against the raw request body (express.raw / request.text()) before any JSON middleware runs. Never verify against a re-serialized object.",
    sources: [
      { label: "Razorpay Docs — Validate Webhooks", url: "https://razorpay.com/docs/webhooks/validate-test" },
      { label: "razorpay-java issue #351 — byte[] overloads for encoding bugs", url: "https://github.com/razorpay/razorpay-java/issues/351" },
    ],
  },
  {
    slug: "razorpay-webhook-secret-rotation",
    provider: "razorpay",
    category: "payments",
    severity: "high",
    title: "Retried webhooks are signed with the old secret after rotation",
    what:
      "When you rotate your webhook secret, Razorpay keeps signing retried events with the secret that was active when the event was first generated. Verifying only against the current secret rejects legitimate retries — and the failures start suddenly, days after the rotation, with no config change on your side.",
    detect:
      "On verification failure, attempt verification with the previous secret before rejecting the request.",
    sources: [
      { label: "Razorpay Docs — Webhooks FAQs", url: "https://razorpay.com/docs/webhooks/faqs/" },
    ],
  },
  {
    slug: "razorpay-rbi-emandate-15k",
    provider: "razorpay",
    category: "payments",
    severity: "critical",
    title: "Recurring charges over ₹15,000 silently fail under RBI e-mandate rules",
    what:
      "RBI's e-mandate framework requires Additional Factor Authentication for every recurring debit above ₹15,000. These are compliance failures, not soft declines — automatic retries will not fix them. Razorpay retries a pending subscription for 3 days (T+1, T+2, T+3), then moves it to halted. If you don't watch subscription.pending / subscription.halted webhooks, paying customers silently churn.",
    detect:
      "Treat subscription.pending and subscription.halted as pageable events. Recovery must be customer-initiated — deep-link them into the AFA/mandate re-registration flow, not a generic billing page.",
    sources: [
      { label: "Razorpay Blog — RBI e-mandate regulations", url: "https://razorpay.com/blog/rbi-e-mandate-regulations/" },
      { label: "Razorpay Docs — Subscription payment retries", url: "https://razorpay.com/docs/payments/subscriptions/payment-retries/?preferred-country=IN" },
      { label: "Slicker — RBI-approval-required declines in India", url: "https://www.slickerhq.com/resources/blog/rbi-approval-required-india-payment-declines" },
    ],
  },
  {
    slug: "phonepe-pending-no-webhook",
    provider: "phonepe",
    category: "payments",
    severity: "high",
    title: "No webhook at all while a transaction sits in PENDING",
    what:
      "PhonePe only fires webhooks when a transaction reaches a terminal state (SUCCESS or FAILED). A UPI payment can sit in PENDING for hours — no callback, no error, no signal. Teams that rely on callbacks alone ship orders that were never paid, or abandon orders that later succeed.",
    detect:
      "Webhooks are not guaranteed — run a scheduled job that polls the Order Status API for any transaction without a terminal update.",
    sources: [
      { label: "PhonePe Developer — Troubleshooting", url: "https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/troubleshoot" },
      { label: "PhonePe Developer — General FAQs", url: "https://developer.phonepe.com/payment-gateway/general-faqs" },
    ],
  },
  {
    slug: "phonepe-webhook-ack-timeout",
    provider: "phonepe",
    category: "payments",
    severity: "medium",
    title: "Webhook delivery marked failed if you don't ACK within 3–5 seconds",
    what:
      "Your endpoint must return 200 OK within 3–5 seconds of receiving a PhonePe webhook. Do anything heavy — a slow DB write, a downstream API call — before responding, and the delivery is marked failed. Rate-limiting or strict validation rules on the endpoint silently block callbacks too.",
    detect:
      "ACK immediately, process asynchronously. Keep the webhook route free of rate limits and heavy middleware.",
    sources: [
      { label: "PhonePe Developer — Webhook API reference", url: "https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/api-reference/webhook" },
    ],
  },
  {
    slug: "shiprocket-non-serviceable-rto",
    provider: "shiprocket",
    category: "logistics",
    severity: "high",
    title: "Orders accepted for non-serviceable pincodes — then RTO'd at your cost",
    what:
      "Shiprocket can accept a booking even when the destination pincode is outside the courier's serviceable network. The shipment dispatches, fails delivery, and comes back as RTO — you pay both ways and the customer experience is already burned. The API acceptance tells you nothing about real serviceability.",
    detect:
      "Validate pincode serviceability at checkout, before the order enters the fulfilment queue. Don't rely on order acceptance as a serviceability signal.",
    sources: [
      { label: "Metaport — Address validation for Indian e-commerce", url: "https://metaport.in/address-validation-ecommerce-india/" },
      { label: "RouteOneX — Pincode serviceability checker", url: "https://routeonex.com/tools/pincode-serviceability-checker" },
      { label: "Operator report — non-serviceable pincode RTO pattern", url: "https://www.linkedin.com/posts/archithajain_ecommerce-customerexperience-logistics-activity-7376275622244982784-x_fN" },
    ],
  },
  {
    slug: "delhivery-nsz-serviceability",
    provider: "delhivery",
    category: "logistics",
    severity: "medium",
    title: "NSZ (Non-Serviceable Zone) flags most integrations never check",
    what:
      "Delhivery's pincode serviceability API returns explicit NSZ responses and COD/prepaid flags per pincode. Most integrations never call it — they find out a pincode is unserviceable only when the waybill fails or the shipment stalls, days after the customer paid.",
    detect:
      "Call the serviceability API at checkout and cache the response. Treat NSZ as a hard block, not a warning.",
    sources: [
      { label: "Delhivery Dev Portal — Pincode Serviceability (mirror)", url: "https://www.scribd.com/document/728573686/Developer-Portal-Pincode-Serviceability" },
    ],
  },
  {
    slug: "cashfree-sdk-status-callback",
    provider: "cashfree",
    category: "payments",
    severity: "high",
    title: "SDK no longer returns final payment status — client callbacks lie",
    what:
      "Current Cashfree SDKs don't return the transaction status to the client. If your fulfilment logic trusts the onVerify callback or the SDK response, you'll fulfil unpaid orders. Worse: older integrations using order_token break outright — current SDKs need a payment_session_id created with API version 2023-08-01.",
    detect:
      "Treat the SDK callback as a signal, not a truth. Always confirm status with a server-to-server Get Payments for Order call before fulfilling.",
    sources: [
      { label: "Cashfree Docs — React Native SDK", url: "https://www.cashfree.com/docs/payments/online/element/mobile/react-native" },
      { label: "react-native-cashfree-pg-sdk issue #55", url: "https://github.com/cashfree/react-native-cashfree-pg-sdk/issues/55" },
      { label: "react-native-cashfree-pg-sdk issue #78", url: "https://github.com/cashfree/react-native-cashfree-pg-sdk/issues/78" },
      { label: "Cashfree Docs — API error reference", url: "https://www.cashfree.com/docs/api-reference/payments/errors" },
    ],
  },
  {
    slug: "msg91-dlt-variable-length",
    provider: "msg91",
    category: "communication",
    severity: "high",
    title: "DLT scrubbing silently fails when a variable exceeds 40 characters",
    what:
      "DLT templates enforce a 40-character limit per {#var#}. Send a longer value — a name, an order URL — and the message fails DLT scrubbing. No API error at send time; the SMS just never arrives. OTP flows die and support can't see why.",
    detect:
      "Split long values across multiple variables ({#var#}{#var#}), and watch MSG91 logs for 'DLT Scrubbing Failed' / 'Template not matched on DLT'.",
    sources: [
      { label: "MSG91 Help — SMS not matched with DLT template", url: "https://msg91.com/help/dlt-registration-in-india/error-description-sms-not-matched-with-dlt-template" },
      { label: "MSG91 Help — Reasons behind a failed message", url: "https://msg91.com/help/delivery-report/what-are-the-reasons-behind-a-failed-message" },
    ],
  },
  {
    slug: "msg91-header-not-associated",
    provider: "msg91",
    category: "communication",
    severity: "medium",
    title: "Sender ID not associated with the DLT template → delivery silently dies",
    what:
      "Your Header (Sender ID) must be explicitly associated with each approved template on the DLT portal. If the mapping is missing — or the header/template gets blacklisted, inactivated, or suspended — messages fail downstream of the API call. MSG91 returns 211 / 'Template ID missing' style errors only in some configs.",
    detect:
      "Verify Header↔Template association on the DLT portal after any template change, and alert on DLT-related failure reasons in delivery reports.",
    sources: [
      { label: "MSG91 Help — Header/Sender ID not associated with DLT template", url: "https://msg91.com/help/dlt-registration-in-india/error-description-header-sender-id-not-associated-with-the-dlt-template" },
      { label: "MSG91 Help — DLT-related failure reasons", url: "https://msg91.com/help/delivery-report/dlt-related-failure-reasons" },
    ],
  },
  {
    slug: "gupshup-session-window-expiry",
    provider: "gupshup",
    category: "communication",
    severity: "high",
    title: "24-hour session window expiry: session messages silently rejected",
    what:
      "WhatsApp session messages only work within 24 hours of the user's last message. Outside the window, Gupshup rejects non-template sends with errors 1004–1008 (inactive session, not opted-in, template mismatch). Gupshup has also deprecated template matching — full-body messages no longer auto-match templates.",
    detect:
      "Use the Template ID API (api.gupshup.io/wa/api/v1/template/msg) with an approved template for anything outside the session window. Watch delivery webhooks for failed statuses, not just the send response.",
    sources: [
      { label: "Gupshup Docs — Error and status messages", url: "https://docs.gupshup.io/docs/error-and-status-messages" },
      { label: "Gupshup Docs — Template messages", url: "https://docs.gupshup.io/docs/template-messages" },
      { label: "Gupshup — Technical & policy updates 2025", url: "https://support.gupshup.io/hc/en-us/articles/42866242419609-Gupshup-Technical-and-Policy-Updates-2025" },
    ],
  },
];

export const PROVIDERS = ["razorpay", "phonepe", "cashfree", "shiprocket", "delhivery", "msg91", "gupshup"];

export const SEVERITY_STYLES = {
  critical: "border-white/40 bg-white/10 text-white",
  high: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  medium: "border-zinc-700 bg-transparent text-zinc-500",
};
