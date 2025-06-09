import React from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import Welcome from "./Welcome";
import { toast } from "react-toastify";

const appName = import.meta.env.VITE_APP_NAME;
const apiScope = import.meta.env.VITE_API_SCOPE;

const SignInButton: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup({
        scopes: [apiScope],
      });

      // Step 2: Optionally store user/account info
      const account = loginResponse.account;
      if (account) {
        instance.setActiveAccount(account);
      }
      // After successful login, navigate to the stock base page
      navigate("/stockbase");
    } catch (e) {
      toast.error("Login failed.");
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

const Landing: React.FC = () => <LandingContent />;

export default Landing;
