import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Main, Wrapper } from "./components/agnostic/wrappers";

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
        <Main>
          <Wrapper>{children}</Wrapper>
        </Main>
      </body>
    </html>
  );
}
