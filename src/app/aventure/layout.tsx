import { InventoryProvider } from "@/components/aventure/inventory-provider";

export default function AventureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InventoryProvider>{children}</InventoryProvider>;
}
