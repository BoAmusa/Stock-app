import React from "react";
import type { WelcomeProps } from "./Welcome.props";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { enterButtonStyle } from "../../util/styles/Styles";

export const Welcome: React.FC<WelcomeProps> = ({ route }) => {
  const { accounts } = useMsal();
  const navigate = useNavigate();
  const onEnter = () => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div>
      <h2>Welcome, {accounts[0]?.name || "User"}!</h2>
      <button style={enterButtonStyle} onClick={onEnter}>
        Enter
      </button>
    </div>
  );
};

export default Welcome;
