import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streaming AI Chat",
  description: "Streaming chat interface built with the AI SDK and Claude",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
