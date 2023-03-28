import {useEffect, useState} from "react";
import Container from "../components/Container";
import FoamBox from "../components/layout/FoamBox";
import Input from "../components/basic/Input";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/basic/Button";
import {callApi} from "../apis/request";
import {POST} from "../apis/apiPath";
import {getCookie, removeCookie, setCookie} from "../apis/cookies";
import {DeviceMobileIcon} from "@primer/octicons-react";
import {useRouter} from "next/router";

export default function Login() {
    const router = useRouter();
    const [account, setAccount] = useState(null);
    const [token, setToken] = useState(null);
    const [clientInfo, setClientInfo] = useState(null);

    useEffect(() => {
        callApi({url: "/api/user/client/info"}).then(r => {
            if (r.success) {
                setClientInfo(r.data);
            } else {
                console.error(r.message);
            }
        });
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

    return <Container>
        {token ?
            <div>
                {
                    clientInfo?.weChatOpenId ?
                        <div>
                            <FoamBox>
                                <Button>
                                    <div className="leftAndRight">
                                        <div className="left">
                                            <DeviceMobileIcon/> 微信已绑定
                                        </div>
                                        <div className="right">
                                            {clientInfo.weChatOpenId}
                                        </div>
                                    </div>
                                </Button>
                            </FoamBox>
                        </div>
                        :
                        <div onClick={() => {
                            router.push("/bind/wechat").then((r) => r);
                        }}>
                            <FoamBox>
                                <Button>
                                    <DeviceMobileIcon/> 绑定微信账户
                                </Button>
                            </FoamBox>
                        </div>
                }
                <FoamBox>
                    <Button onClick={logout}>退出登录</Button>
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
                    <Button onClick={login}>登录</Button>
                </FoamBox>
            </div>
        }
        <NavigationBar active={4}/>
        <style jsx>{`
          .leftAndRight {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .leftAndRight .left {
            text-align: left;
          }

          .leftAndRight .right {
            text-align: right;
          }
        `}</style>
    </Container>
}