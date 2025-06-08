import type { CSSProperties } from "react";

export const cardStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  width: "250px",
  minWidth: "250px",
  flex: "0 0 auto",
  background: "inherit",
};

export const cardSaveButtonStyle: CSSProperties = {
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: "14px",
  marginTop: "auto", // helps push it to the bottom inside a flex container
  alignSelf: "center", // centers the button horizontally
};

export const searchButtonStyle: CSSProperties = {
  position: "absolute",
  right: "1px",
  top: 0,
  bottom: 0,
  background: "none",
  border: "none",
  padding: "0 12px", // horizontal padding
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const searchInputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 40px 8px 8px",
  fontSize: "16px",
  boxSizing: "border-box",
};

export const removeButtonStyle: CSSProperties = {
  position: "absolute",
  top: "6px",
  right: "8px",
  background: "transparent",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  color: "#888",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 1,
};

export const removeButtonCardStyle: CSSProperties = {
  position: "relative", // <-- Add this line
  border: "1px solid #ccc",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  width: "250px",
  minWidth: "250px",
  flex: "0 0 auto",
  background: "inherit",
};

export const signOutButtonStyle: CSSProperties = {
  backgroundColor: "transparent",
  border: "2px solid #0078D4", // MS blue or any highlight color
  borderRadius: "6px",
  padding: "8px 16px",
  fontSize: "14px",
  cursor: "pointer",
  color: "#0078D4",
  fontWeight: 600,
  transition: "background 0.2s ease",
  outline: "none",
};

export const enterButtonStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  border: "2px solid #28a745", // green for action
  borderRadius: "6px",
  padding: "8px 16px",
  fontSize: "14px",
  cursor: "pointer",
  color: "#28a745",
  fontWeight: 600,
  transition: "background 0.2s ease, color 0.2s ease",
  outline: "none",
};
