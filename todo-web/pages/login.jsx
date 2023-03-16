import {useState} from "react";
import Container from "../components/Container";
import FoamBox from "../components/layout/FoamBox";
import Input from "../components/basic/Input";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/basic/Button";

export default function Login() {
    const [account, setAccount] = useState(null);

    function login() {
        console.log(account)
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
        <NavigationBar/>
    </Container>
}