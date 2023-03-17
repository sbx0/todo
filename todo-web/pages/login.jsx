import {useState} from "react";
import Container from "../components/Container";
import FoamBox from "../components/layout/FoamBox";
import Input from "../components/basic/Input";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/basic/Button";
import {callApi} from "../apis/taskApi";
import {POST} from "../apis/apiPath";
import {setCookie} from "../apis/cookies";

export default function Login() {
    const [account, setAccount] = useState(null);

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
            }
        });
    }

    return <Container>
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
        <NavigationBar active={4}/>
    </Container>
}