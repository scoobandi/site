import { createHash, timingSafeEqual } from "node:crypto";

const TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";
const DEFAULT_PIXEL_ID = "CRFIQ0JC77U82D2B15AG";
const QUIZ_ID = "pDmHSDUSVSBSMg099kYJ";
const QUIZ_PAGE_URL = "https://scoobandi.com/#dog-assessment";

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  };
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function safeEqual(actual, expected) {
  if (!actual || !expected) return false;
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function parseBody(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  return JSON.parse(raw);
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "method_not_allowed" });
  }

  const webhookSecret = process.env.GHL_TIKTOK_WEBHOOK_SECRET;
  const suppliedSecret = event.headers?.["x-webhook-secret"] || event.headers?.["X-Webhook-Secret"];
  if (!safeEqual(suppliedSecret, webhookSecret)) {
    return json(401, { ok: false, error: "unauthorized" });
  }

  let payload;
  try {
    payload = parseBody(event);
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const contactId = String(payload.contact_id || "").trim();
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  if (!contactId || (!email && !phone)) {
    return json(422, { ok: false, error: "missing_contact_match_data" });
  }

  const accessToken = process.env.TIKTOK_EVENTS_ACCESS_TOKEN;
  const pixelId = process.env.TIKTOK_PIXEL_ID || DEFAULT_PIXEL_ID;
  if (!accessToken) {
    return json(500, { ok: false, error: "tracking_not_configured" });
  }

  // One event per contact and quiz. This keeps HighLevel retries and repeat webhook
  // deliveries from inflating completed-lead counts.
  const eventId = `quiz-${sha256(`${QUIZ_ID}:${contactId}`).slice(0, 48)}`;
  const user = {
    external_id: [sha256(contactId)],
  };
  if (email) user.email = [sha256(email)];
  if (phone) user.phone = [sha256(phone)];
  if (payload.ttclid) user.ttclid = String(payload.ttclid).trim();

  const tiktokPayload = {
    event_source: "web",
    event_source_id: pixelId,
    data: [
      {
        event: "SubmitForm",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        user,
        page: { url: QUIZ_PAGE_URL },
        properties: {
          description: "Completed What Does Your Dog Actually Need quiz",
        },
      },
    ],
  };

  // Preview deployments can set TikTok's Test Events code. Production leaves
  // this unset so real quiz completions are recorded normally.
  if (process.env.TIKTOK_TEST_EVENT_CODE) {
    tiktokPayload.test_event_code = process.env.TIKTOK_TEST_EVENT_CODE;
  }

  let response;
  let result;
  try {
    response = await fetch(TIKTOK_EVENTS_URL, {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tiktokPayload),
    });
    result = await response.json();
  } catch {
    return json(502, { ok: false, error: "tiktok_unreachable", event_id: eventId });
  }

  if (!response.ok || result?.code !== 0) {
    console.error("TikTok quiz event rejected", {
      eventId,
      status: response.status,
      code: result?.code,
      message: result?.message,
    });
    return json(502, {
      ok: false,
      error: "tiktok_rejected_event",
      event_id: eventId,
      provider_code: result?.code,
    });
  }

  return json(200, { ok: true, event_id: eventId });
}
