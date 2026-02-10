"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { CommandPalette } from "@/components/layout/command-palette";
import { PriyaPanel, PriyaFAB } from "@/components/dashboard/priya-panel";

interface DashboardContextType {
  openCommandPalette: () => void;
  openPriya: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  openCommandPalette: () => {},
  openPriya: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export function DashboardShell({ children }: { children: ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [priyaOpen, setPriyaOpen] = useState(false);

  // ⌘K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        openCommandPalette: () => setCmdOpen(true),
        openPriya: () => setPriyaOpen(true),
      }}
    >
      {children}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <PriyaPanel open={priyaOpen} onOpenChange={setPriyaOpen} />
      <PriyaFAB onClick={() => setPriyaOpen(true)} />
    </DashboardContext.Provider>
  );
}
