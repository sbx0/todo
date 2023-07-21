import '../styles/globals.css'
import '../styles/nprogress.css';
import {callApi} from "../apis/request";
import Login from "./login/page";
import {ApiPrefix, GET, GetToken} from "../apis/apiPath";
import {cookies} from "next/headers";

export default function RootLayout({children}) {
    let isLogin = false;
    let cookieToken = cookies().get("token");
    let token;
    if (cookieToken) {
        token = cookieToken.value;
        token = getToken(token);
    }
    if (token) {
        isLogin = true;
    }

    return <html lang="zh-CN">
    <body>
    {isLogin ? children : <Login/>}
    </body>
    </html>;
}

async function getToken(token) {
    return callApi({method: GET, url: ApiPrefix + GetToken, token: token})
        .then(response => {
            return response.success;
        });
}
