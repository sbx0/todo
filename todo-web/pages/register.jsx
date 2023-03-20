import {useEffect, useState} from "react";
import Container from "../components/Container";
import FoamBox from "../components/layout/FoamBox";
import Input from "../components/basic/Input";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/basic/Button";
import {callApi} from "../apis/request";
import {POST} from "../apis/apiPath";
import {useRouter} from "next/router";
import {removeCookie} from "../apis/cookies";

export default function Register() {
    const [account, setAccount] = useState(null);
    const router = useRouter();

    useEffect(() => {
        removeCookie('token');
    }, [])

    function register() {
        if (account == null || account.username == null || account.password == null) {
            return;
        }
        callApi({
            method: POST,
            url: "/api/user/client/register",
            params: account
        }).then(r => {
            if (!r.success) {
                console.log(r.message)
            } else {
                router.push("/login").then(r => r);
            }
        });
    }

    return <Container>
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
                <Button name={"注册"} onClick={register}/>
            </FoamBox>
        </div>
        <NavigationBar active={4}/>
    </Container>
}