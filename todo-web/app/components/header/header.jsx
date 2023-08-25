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
        <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Next Todo</h1>
            <nav>
                <ul className="flex space-x-4">
                    {/*<li><a href="#" className="text-white">Home</a></li>*/}
                </ul>
            </nav>
        </div>
    </header>;
}