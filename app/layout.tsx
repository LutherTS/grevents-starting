import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Grevents (starting)",
    default: "Grevents (starting)",
  },
  description: "Personal info selects and reads. And now beyond.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Theme> */}
        {children}
        {/* <ThemePanel /> */}
        {/* </Theme> */}
      </body>
    </html>
  );
}
