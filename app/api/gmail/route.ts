import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface GmailMessageRef { id: string; }
interface GmailPart {
  mimeType: string;
  body?: { data?: string };
  parts?: GmailPart[];
}
interface GmailMessage {
  id: string;
  payload: {
    headers: { name: string; value: string }[];
    body?: { data?: string };
    parts?: GmailPart[];
  };
  snippet: string;
}

function decodeBase64(data: string): string {
  try {
    const b64 = data.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(b64, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

function extractBody(part: { mimeType?: string; body?: { data?: string }; parts?: GmailPart[] }): string {
  if (part.body?.data) return decodeBase64(part.body.data);
  if (part.parts) {
    // Prefer plain text
    for (const p of part.parts) {
      if (p.mimeType === "text/plain" && p.body?.data) return decodeBase64(p.body.data);
    }
    // Fallback: recurse
    for (const p of part.parts) {
      const nested = extractBody(p);
      if (nested.length > 20) return nested;
    }
  }
  return "";
}

function getHeader(headers: { name: string; value: string }[], name: string): string {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (session.error === "RefreshTokenError") {
    return NextResponse.json({ error: "Session expired — please reconnect Gmail" }, { status: 401 });
  }

  const token = session.accessToken;

  try {
    // Fetch last 20 inbox messages (skip promotions/social/spam)
    const listRes = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=20&q=in:inbox category:primary -label:sent",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!listRes.ok) {
      const err = await listRes.json();
      return NextResponse.json({ error: err.error?.message ?? "Gmail API error" }, { status: listRes.status });
    }

    const listData: { messages?: GmailMessageRef[] } = await listRes.json();
    const messageRefs = listData.messages ?? [];

    // Fetch each message in parallel (max 15)
    const messages = await Promise.all(
      messageRefs.slice(0, 15).map(async ({ id }) => {
        const res = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return null;
        return res.json() as Promise<GmailMessage>;
      })
    );

    const emails: string[] = messages
      .filter((m): m is GmailMessage => m !== null)
      .map(msg => {
        const from    = getHeader(msg.payload.headers, "from");
        const subject = getHeader(msg.payload.headers, "subject");
        const date    = getHeader(msg.payload.headers, "date");
        const body    = extractBody(msg.payload).slice(0, 3000).trim();
        const text    = body || msg.snippet;

        return [
          `From: ${from}`,
          `Date: ${date}`,
          `Subject: ${subject}`,
          ``,
          text,
        ].join("\n");
      })
      .filter(e => e.trim().length > 40);

    return NextResponse.json({ emails, count: emails.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch emails";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
