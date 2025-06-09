import { msalInstance } from "./MsalConfig";

const API_SCOPE = import.meta.env.VITE_API_SCOPE;

export const getAccessToken = async (): Promise<string> => {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw new Error("No active user found. User must be signed in.");
  }

  const tokenResponse = await msalInstance.acquireTokenSilent({
    scopes: [API_SCOPE],
    account,
  });

  return tokenResponse.accessToken;
};
