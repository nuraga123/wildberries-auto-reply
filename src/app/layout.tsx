import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wildberries-help",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#D031E3" }}>{children}</body>
    </html>
  );
}
