import {useEffect, useState} from "react";
import Container from "../components/Container";
import FoamBox from "../components/layout/FoamBox";
import Input from "../components/basic/Input";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/basic/Button";
import {callApi} from "../apis/request";
import {POST} from "../apis/apiPath";
import {getCookie, removeCookie, setCookie} from "../apis/cookies";

export default function Login() {
    const [account, setAccount] = useState(null);
    const [token, setToken] = useState(null);

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
                console.log(r.message)
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

    return <Container>
        {token ?
            <div>
                <FoamBox>
                    <Button name={"退出登录"} onClick={logout}/>
                </FoamBox>
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