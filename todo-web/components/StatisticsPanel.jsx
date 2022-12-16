import styles from "./StatisticsPanel.module.css";
import useFetch from "../hooks/useFetch";
import {useEffect, useState} from "react";

export default function StatisticsPanel() {
    const [loading, setLoading] = useState(false);
    const {data, refresh} = useFetch({
        method: 'GET',
        url: '/api/task/statistics',
        setLoading: setLoading
    });
    const [completed, setCompleted] = useState(0);
    const [uncompleted, setUncompleted] = useState(0);

    useEffect(() => {
        if (data != null) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === 'completed') {
                    setCompleted(data[i].value);
                } else if (data[i].key === 'uncompleted') {
                    setUncompleted(data[i].value);
                }
            }
        }
    }, [data]);

    return <div className={styles.container}>
        <div className={styles.item}>
            <div className={styles.itemTitle}>
                Completed
            </div>
            <div className={`${styles.itemValue} ${styles.completed}`}>
                {completed}
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.itemTitle}>
                Uncompleted
            </div>
            <div className={styles.itemValue}>
                {uncompleted}
            </div>
        </div>
    </div>;
}
