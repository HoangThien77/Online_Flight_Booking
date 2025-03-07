// app/providers.tsx
import { NextUIProvider } from "@nextui-org/react";
import "@/app/globals.css";

export function NextUI({ children }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
