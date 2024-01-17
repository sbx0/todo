"use client"

import {useEffect, useState} from "react";

export default function Header() {
    const [example, setExample] = useState(false);

    useEffect(() => {
        if (example) {
            setExample(true);
        }
    }, []);


    return <header className="bg-gray-800 text-white px-4 py-2">
        <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-bold cursor-pointer">
                <div onClick={() => window.location.href = "/"}>
                    Next Todo
                </div>
            </h1>
            <h1 className="text-xl font-bold cursor-pointer ml-5">
                <div onClick={() => window.location.href = "/login"}>
                    Login
                </div>
            </h1>
            <h1 className="text-xl font-bold cursor-pointer ml-5">
                <div onClick={() => window.location.href = "/file"}>
                    File
                </div>
            </h1>
        </div>
    </header>;
}