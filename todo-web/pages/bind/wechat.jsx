import {useEffect, useRef, useState} from "react";
import Container from "../../components/Container";
import {callApi} from "../../apis/request";
import FoamBox from "../../components/layout/FoamBox";
import Button from "../../components/basic/Button";
import {ArrowLeftIcon} from "@primer/octicons-react";
import {useRouter} from "next/router";

export default function BindWeChat() {
    const router = useRouter();
    const [qrcode, setQrcode] = useState(null);
    const [count, setCount] = useState(10);
    const timer = useRef(() => {
    });

    useEffect(() => {
        timer.current = setInterval(() => {
            if (count > 0) {
                setCount(count - 1);
            }
            if (count === 1) {
                setQrcode(null);
            }
        }, 1000);
        return () => {
            clearInterval(timer.current);
        };
    });

    function getWeChatQRCode() {
        callApi({
            url: "/api/wechat/qrcode"
        }).then(r => {
            if (r.success) {
                setQrcode(r.data);
                setCount(60);
            } else {
                console.error(r.message)
            }
        });
    }

    return <Container>
        <FoamBox onClick={() => {
            router.back();
        }}>
            <Button>
                <ArrowLeftIcon/> 返回上一页
            </Button>
        </FoamBox>
        <FoamBox style={{
            textAlign: 'center'
        }}>
            {
                qrcode && count > 0 ?
                    <FoamBox>
                        <span>还有 {count} 秒失效</span>
                    </FoamBox>
                    :
                    <></>
            }
            <FoamBox>
                {
                    qrcode ?
                        <img
                            src={qrcode}
                            alt={'wechat_qrcode'}
                            width={300}
                            height={300}
                        />
                        :
                        <Button onClick={() => getWeChatQRCode()}>已失效，点击刷新</Button>
                }
            </FoamBox>
        </FoamBox>
    </Container>
}