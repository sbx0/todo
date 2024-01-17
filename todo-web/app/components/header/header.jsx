"use client"

import {useEffect} from "react";
import {callApi} from "../../../apis/request";
import {GET, GetToken} from "../../../apis/apiPath";
import {setCookie} from "../../../apis/cookies";

export default function Header() {

    useEffect(() => {
        const fetchData = async () => {
            callApi({method: GET, url: GetToken}).then(r => {
                if (!r.success) {
                    console.error(r.message);
                    window.location.href = "/login"
                } else {
                    setCookie('token', r.data);
                }
            });
        };

        fetchData().then(r => r);

        const intervalId = setInterval(fetchData, 60000); // 每隔 60 秒请求一次接口

        return () => {
            clearInterval(intervalId); // 在组件卸载时清除定时器
        };
    }, []);


    return <header className="bg-gray-800 text-white px-4 py-2">
        <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-bold cursor-pointer">
                <div onClick={() => window.location.href = "/tasks/0"}>
                    Next Todo
                </div>
            </h1>
            <h1 className="text-xl font-bold cursor-pointer ml-5">
                <div onClick={() => window.location.href = "/file"}>
                    File
                </div>
            </h1>
            <h1 className="text-xl font-bold cursor-pointer ml-5">
                <div onClick={() => window.location.href = "/login"}>
                    Login
                </div>
            </h1>
        </div>
    </header>;
}