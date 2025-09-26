"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getInventaire } from "@/lib/inventory";

type InventaireCtx = {
  inventaire: any[];
  refresh: () => Promise<void>;
};

const InventaireContext = createContext<InventaireCtx | null>(null);

export function InventaireProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [inventaire, setInventaire] = useState<any[]>([]);

  async function refresh() {
    if (!userId) return;
    const data = await getInventaire(userId);
    setInventaire(data);
  }

  useEffect(() => {
    refresh();
  }, [userId]);

  return (
    <InventaireContext.Provider value={{ inventaire, refresh }}>
      {children}
    </InventaireContext.Provider>
  );
}

export function useInventaire() {
  const ctx = useContext(InventaireContext);
  if (!ctx)
    throw new Error("useInventaire doit être utilisé dans InventaireProvider");
  return ctx;
}
