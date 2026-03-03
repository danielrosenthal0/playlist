import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plauly",
  description: "Place your songs in the right playlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
