import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/auth/authContext";
import { Plus_Jakarta_Sans } from "next/font/google";
import { DefaultSeo } from "next-seo";
import Head from "next/head";

const jakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <DefaultSeo
        title="Nfig Chat"
        description="Nfig chat for User Flow Generation"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://nfig-chat.vercel.app",
          siteName: "Nfig-Chat",
        }}
        twitter={{
          handle: "@thechi.app",
          site: "@thechi.app",
          cardType: "summary_large_image",
        }}
      />
      <main className={jakartaSans.className}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
