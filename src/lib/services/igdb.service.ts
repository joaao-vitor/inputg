"use cache";

import prisma from "../prisma";

export const getTwitchAccessToken = async () => {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Twitch client ID or secret is not set in environment variables.",
    );
  }

  console.log("Fetching Twitch access token...");
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get Twitch access token: ${response.statusText}`,
    );
  }
  const data = await response.json();
  return data.access_token;
}


export const fetchOnIGDB = async (endpoint: string, body: string) => {
    const accessToken = await getTwitchAccessToken();

    const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
        method: "POST",
        headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID || "",
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "text/plain",
        },
        body: body,
    });
    if (!response.ok) {
      console.log(await response.json())
        throw new Error(`Failed to fetch data from IGDB: ${response.statusText}`);
    }
    return response.json();
}