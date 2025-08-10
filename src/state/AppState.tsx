/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

interface AppStateValue {
  name: string;
  setName: (v: string) => void;
  msg: string;
  setMsg: (v: string) => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <AppStateContext.Provider value={{ name, setName, msg, setMsg }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
