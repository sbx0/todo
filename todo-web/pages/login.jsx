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
import {useTranslations} from "next-intl";

export default function Login({locale}) {
    const t = useTranslations('Login');
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
                                            <DeviceMobileIcon/> {t('wechat is bound')}
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
                                    <DeviceMobileIcon/> {t('bind wechat')}
                                </Button>
                            </FoamBox>
                        </div>
                }
                <FoamBox>
                    <Button onClick={logout}>{t('logout')}</Button>
                </FoamBox>
            </div>
            :
            <div>
                <FoamBox>
                    <label htmlFor={"username"}>{t('username')}</label>
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
                    <label htmlFor={"password"}>{t('password')}</label>
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
                    <Button onClick={login}>{t('login')}</Button>
                </FoamBox>
            </div>
        }
        <FoamBox>
            <select defaultValue={locale} onChange={(event) => {
                router.push('/login', '/login', {locale: event.target.value}).then(r => r);
            }}>
                <option value={'zh-CN'}>Simplified Chinese</option>
                <option value={'en-US'}>English</option>
            </select>
        </FoamBox>
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

export async function getStaticProps(context) {
    let locale = 'zh-CN';
    const accept = ['zh-CN', 'en-US'];
    if (accept.indexOf(context.locale) !== -1) {
        locale = context.locale;
    }
    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by language.
            messages: (await import(`../messages/${locale}.json`)).default,
            locale: context.locale
        }
    };
}