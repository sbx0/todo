import styles from "./FoamBox.module.css";

export default function FoamBox({children}) {
    return <div className={styles.container}>
        {children}
    </div>
}