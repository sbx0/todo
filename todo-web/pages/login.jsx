import {useEffect, useState} from "react";
import Container from "../components/Container";
import FoamBox from "../components/layout/FoamBox";
import Input from "../components/basic/Input";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/basic/Button";
import {callApi} from "../apis/request";
import {POST} from "../apis/apiPath";
import {getCookie, removeCookie, setCookie} from "../apis/cookies";
import Image from "next/image";

export default function Login() {
    const [account, setAccount] = useState(null);
    const [token, setToken] = useState(null);
    const [qrcode, setQrcode] = useState(null);

    useEffect(() => {
        callApi({url: "/api/user/client/hello"}).then(r => r);
        getWeChatQRCode();
    }, [])

    useEffect(() => {
        setToken(getCookie('token'));
    }, [])

    function login() {
        if (account == null || account.username == null || account.password == null) {
            return;
        }
        const token = btoa(`${account.username}:${account.password}`);
        callApi({
            method: POST,
            url: "/api/user/client/login",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + token,
            }
        }).then(r => {
            if (!r.success) {
                console.error(r.message)
            } else {
                setCookie('token', r.data);
                setToken(r.data);
            }
        });
    }

    function logout() {
        removeCookie('token');
        setToken(null);
    }

    function getWeChatQRCode() {
        callApi({
            url: "/api/wechat/qrcode"
        }).then(r => {
            if (r.success) {
                setQrcode(r.data);
            } else {
                console.error(r.message)
            }
        });
    }

    return <Container>
        {token ?
            <div>
                <FoamBox>
                    <Button name={"退出登录"} onClick={logout}/>
                </FoamBox>
                {
                    qrcode != null ?
                        <Image src={qrcode} alt={'wechat_qrcode'} onClick={() => getWeChatQRCode()}/>
                        :
                        <></>
                }
            </div>
            :
            <div>
                <FoamBox>
                    <label htmlFor={"username"}>账户</label>
                </FoamBox>
                <FoamBox>
                    <Input id="username"
                           defaultValue={account?.username}
                           onChange={(event) => {
                               setAccount({
                                   ...account,
                                   username: event.target.value
                               })
                           }}/>
                </FoamBox>
                <FoamBox>
                    <label htmlFor={"password"}>密码</label>
                </FoamBox>
                <FoamBox>
                    <Input id="password"
                           type={'password'}
                           defaultValue={account?.password}
                           onChange={(event) => {
                               setAccount({
                                   ...account,
                                   password: event.target.value
                               })
                           }}/>
                </FoamBox>
                <FoamBox>
                    <Button name={"登录"} onClick={login}/>
                </FoamBox>
            </div>
        }
        <NavigationBar active={4}/>
    </Container>
}