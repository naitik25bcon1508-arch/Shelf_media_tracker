import { useState } from "react";
import AuthScreen from "@/components/AuthScreen";
import Dashboard from "@/components/Dashboard";
import { getSession, logout } from "@/lib/auth";

export default function App() {
  const [username, setUsername] = useState<string | null>(() => getSession());

  function handleLogout() {
    logout();
    setUsername(null);
  }

  if (!username) {
    return <AuthScreen onAuth={setUsername} />;
  }

  return <Dashboard username={username} onLogout={handleLogout} />;
}
