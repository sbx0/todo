import styles from "./Padding.module.css";

export default function Padding({children, hidden}) {
    return <div className={styles.padding} hidden={hidden}>
        {children}
    </div>
}