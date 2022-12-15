import styles from '../styles/Setting.module.css';

import NavigationBar from "../components/NavigationBar";
import StatisticsPanel from "../components/StatisticsPanel";
import {useState} from "react";
import Loading from "../components/Loading";

export default function Setting() {
    const [loading, setLoading] = useState(false);

    return <div className={styles.container}>
        <StatisticsPanel setLoading={setLoading}/>
        <NavigationBar active={1}/>
        <Loading active={loading}></Loading>
    </div>
}
