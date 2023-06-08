import {useEffect, useState} from "react";
import styles from "./Empty.module.css";

export default function Empty() {
    const [example, setExample] = useState(false);

    useEffect(() => {
        if (example) {
            setExample(true);
        }
    }, []);


    return <div className={`${styles.main}`}>

    </div>;
}