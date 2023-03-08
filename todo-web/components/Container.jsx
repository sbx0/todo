import styles from "./Container.module.css";
import Head from "next/head";

export default ({children}) => {
    return <div className={styles.main}>
        <Head>
            <title>{process.env.NODE_ENV === 'development' ? 'THIS IS DEV ENV' : 'Next Todo'}</title>
            <meta name="description" content="Next Todo App"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        {/*<Script defer src="https://static.cloudflareinsights.com/beacon.min.js"*/}
        {/*        data-cf-beacon="{'token': '0d9aa21cb1b14eeba00f56df49e157dc'}"></Script>*/}

        <main className={styles.scroll}>
            {children}
        </main>
    </div>
}
