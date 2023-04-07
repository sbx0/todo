import '../styles/globals.css'
import '../styles/nprogress.css';
import {useEffect} from "react";
import {useRouter} from "next/router";
import NProgress from "nprogress";

function MyApp({Component, pageProps}) {
    const router = useRouter();

    useEffect(() => {
        router.events.on("routeChangeStart", () => {
            NProgress.start();
        });
        router.events.on("routeChangeComplete", () => {
            NProgress.done();
        });
        router.events.on("routeChangeError", () => {
            NProgress.done();
        });
    }, []);


    return <Component {...pageProps} />
}

export default MyApp
