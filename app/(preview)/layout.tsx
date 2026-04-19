import "./globals.css";
import { BotIdClient } from "botid/client";
import { Metadata } from "next";
import { Toaster } from "sonner";

const protectedRoutes = [
  {
    path: "/api/chat",
    method: "POST",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-roundtrips.vercel.app"),
  title: "Automatic Multiple Tool Steps Preview",
  description: "Automatically handle multiple tool steps using the AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <BotIdClient protect={protectedRoutes} />
      </head>
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
