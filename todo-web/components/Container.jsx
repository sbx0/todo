import styles from "./Container.module.css";
import Head from "next/head";
import Script from "next/script";

export default ({children}) => {
    return <div className={styles.main}>
        <Head>
            <title>Next Todo App</title>
            <meta name="description" content="Generated by create next app"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <Script defer src="https://static.cloudflareinsights.com/beacon.min.js"
                data-cf-beacon="{'token': '0d9aa21cb1b14eeba00f56df49e157dc'}"></Script>

        <main className={styles.scroll}>
            {children}
        </main>
    </div>
}
