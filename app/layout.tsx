import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Main, Wrapper } from "./components/agnostic/wrappers";
// import "@radix-ui/themes/styles.css";
// import { Theme, ThemePanel } from "@radix-ui/themes";
// import { ThemeProvider } from "next-themes";

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
    <html
      lang="en"
      // suppressHydrationWarning
    >
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class"> */}
        {/* <Theme> */}
        <Main>
          <Wrapper>{children}</Wrapper>
        </Main>
        {/* <ThemePanel /> */}
        {/* </Theme> */}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}

// En vrai, et je le sais déjà, le travail de style est aussi complet et complexe que le travail de la logique, et les deux se font en amont avant le démarrage du projet entier.
// Dans cette itération, j'ai privilégier le back de mon application full-stack, mais à l'avenir la logique et le style devront tous les deux être entièrement conçus avant de commencer le développement.
// On dira que ça me permettra de faire la différence entre quelque chose que j'ai travaillé sur des mois, et quelque chose que je suis littéralement en train d'improviser et d'apprendre sur le tas.
