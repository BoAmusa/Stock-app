const clientId = import.meta.env.VITE_CLIENT_ID;

// MSAL configuration for personal and microsoft accounts
export const msalConfig = {
  auth: {
    clientId: clientId,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: `${window.location.origin}/landing`,
  },
};
