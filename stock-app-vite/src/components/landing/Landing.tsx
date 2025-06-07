import React from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";

const clientId = import.meta.env.VITE_CLIENT_ID;

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: clientId,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const SignInButton: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup().catch((e) => {
      console.error(e);
    });
  };

  return (
    <button
      onClick={handleLogin}
      style={{ padding: "10px 20px", fontSize: "16px" }}
    >
      Sign in with Microsoft
    </button>
  );
};

const Welcome: React.FC = () => {
  const { accounts } = useMsal();
  return (
    <div>
      <h2>Welcome, {accounts[0]?.name || "User"}!</h2>
    </div>
  );
};

const LandingContent: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 100,
      }}
    >
      <h1>Stock App</h1>
      <p>Sign in to continue</p>
      {isAuthenticated ? <Welcome /> : <SignInButton />}
    </div>
  );
};

const Landing: React.FC = () => (
  <MsalProvider instance={msalInstance}>
    <LandingContent />
  </MsalProvider>
);

export default Landing;
