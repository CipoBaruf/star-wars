import type { Metadata } from "next";
import { ClientLayout } from "@/shared/components";
import { locales } from "@/shared/locales";
import "./globals.css";

export const metadata: Metadata = {
  title: locales.site.title,
  description: locales.site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
