"use client";

import styles from "./Login.module.css"
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {callApi} from "../../apis/request";
import {removeCookie, setCookie} from "../../apis/cookies";
import {POST} from "../../apis/apiPath";
import Button from "../../components/basic/Button";
import Input from "../../components/basic/Input";
import Padding from "../../components/beta/Padding";

export default function Login() {
    const router = useRouter();
    const pathname = usePathname();
    const [account, setAccount] = useState(null);

    function login() {
        removeCookie('token');
        if (account == null || account.username == null || account.password == null) {
            return;
        }
        const formData = new URLSearchParams();
        formData.append("username", account.username);
        formData.append("password", account.password);
        callApi({
            method: POST,
            url: "/api/user/client/login",
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(r => {
            if (r.success) {
                setCookie('token', r.data);
                if (pathname === '/login') {
                    router.push("/tasks/0");
                    router.refresh();
                } else {
                    router.refresh();
                }
            }
        });
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.form}`}>
            <Padding>
                <Input id="username"
                       label={"账户"}
                       defaultValue={account?.username}
                       onChange={(event) => {
                           setAccount({
                               ...account,
                               username: event.target.value
                           })
                       }}/>
                <Input id="password"
                       label={"密码"}
                       type={'password'}
                       defaultValue={account?.password}
                       onChange={(event) => {
                           setAccount({
                               ...account,
                               password: event.target.value
                           })
                       }}/>
                <Padding/>
                <Button onClick={login}>登录</Button>
            </Padding>
        </div>
    </div>
}
