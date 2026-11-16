import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export interface GoogleUserPlayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
}

export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleUserPlayload> {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  console.log("PAYLOAD>>", payload);

  if (!payload) {
    throw new Error("No payload in google token");
  }

  return payload as GoogleUserPlayload;
}
