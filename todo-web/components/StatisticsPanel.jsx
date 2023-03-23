import styles from "./StatisticsPanel.module.css";
import useStatistics from "../hooks/useStatistics";
import {getCurrentCategory} from "./task/TaskCategory";

export default function StatisticsPanel() {
    const statistics = useStatistics(getCurrentCategory());
    const initData = statistics.response.data;

    return <div className={styles.container}>
        <div className={styles.item}>
            <div className={styles.itemTitle}>
                未完成
            </div>
            <div className={styles.itemValue}>
                {initData.uncompleted}
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.itemTitle}>
                已完成
            </div>
            <div className={`${styles.itemValue} ${styles.completed}`}>
                {initData.completed}
            </div>
        </div>
    </div>;
}
