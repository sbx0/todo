import styles from "./StatisticsPanel.module.css";
import {useEffect, useState} from "react";

export default function StatisticsPanel({initData}) {
    const [completed, setCompleted] = useState(0);
    const [uncompleted, setUncompleted] = useState(0);

    useEffect(() => {
        if (initData != null) {
            for (let i = 0; i < initData.length; i++) {
                if (initData[i].key === 'completed') {
                    setCompleted(initData[i].value);
                } else if (initData[i].key === 'uncompleted') {
                    setUncompleted(initData[i].value);
                }
            }
        }
    }, [initData]);

    return <div className={styles.container}>
        <div className={styles.item}>
            <div className={styles.itemTitle}>
                未完成
            </div>
            <div className={styles.itemValue}>
                {uncompleted}
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.itemTitle}>
                已完成
            </div>
            <div className={`${styles.itemValue} ${styles.completed}`}>
                {completed}
            </div>
        </div>
    </div>;
}
