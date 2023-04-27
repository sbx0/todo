import Head from "next/head";
import Script from "next/script";
import {useEffect} from "react";
import {callApi} from "../apis/request";
import {setCookie} from "../apis/cookies";
import {useRouter} from "next/router";

export default function Container({children, needLogin = true}) {
    const router = useRouter()

    useEffect(() => {
        if (needLogin) {
            callApi({url: "/api/user/client/token"}).then(r => {
                if (!r.success) {
                    console.error(r.message);
                    router.push('/login').then(r => r);
                } else {
                    setCookie('token', r.data);
                }
            });
        }
    }, [])

    return <div className="main">
        <Head>
            <title>{process.env.NODE_ENV === 'development' ? 'THIS IS DEV ENV' : 'Next Todo'}</title>
            <meta name="description" content="Next Todo App"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <Script defer src="https://static.cloudflareinsights.com/beacon.min.js"
                data-cf-beacon="{'token': 'd226e40aeeb54fe69de90582dea00f0c'}"/>

        <main className="scroll">
            {children}
        </main>
        <style jsx>{`
          .main {
            width: 100%;
            height: 100vh;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 10px 10px 50px 10px;
          }

          .main::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            background-color: rgba(245, 245, 245, 0);
          }

          .main::-webkit-scrollbar {
            width: 5px;
            height: 5px;
            background-color: rgba(245, 245, 245, 0);
          }

          .main::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
            background-color: #555;
          }

          .scroll {
            width: 100%;
            max-width: 750px;
            margin: 0 auto;
          }
        `}</style>
    </div>
}
