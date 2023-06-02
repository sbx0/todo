import styles from "./Padding.module.css";

export default function Padding({children, className, hidden}) {
    return <div className={`${styles.padding} ${className}`} hidden={hidden}>
        {children}
    </div>
}