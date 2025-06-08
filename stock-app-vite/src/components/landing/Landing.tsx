import React from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import Welcome from "./Welcome";

const clientId = import.meta.env.VITE_CLIENT_ID;
const appName = import.meta.env.VITE_APP_NAME;

// MSAL configuration for personal and microsoft accounts
const msalConfig = {
  auth: {
    clientId: clientId,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: `${window.location.origin}/landing`,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const SignInButton: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await instance.loginPopup({
        scopes: ["User.Read"],
      });

      // After successful login, navigate to the stock base page
      navigate("/stockbase");
    } catch (e) {
      console.error(e);
    }
  };

  return <button onClick={handleLogin}>Sign In</button>;
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
      <h1>{appName}</h1>
      {!isAuthenticated && <p>Sign in to continue</p>}
      {isAuthenticated ? <Welcome route="/stockbase" /> : <SignInButton />}
    </div>
  );
};

const Landing: React.FC = () => (
  <MsalProvider instance={msalInstance}>
    <LandingContent />
  </MsalProvider>
);

export default Landing;
