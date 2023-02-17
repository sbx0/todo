import styles from "./TwoEightLayout.module.css"

export default ({children, two}) => {
    return <div className={styles.main}>
        <div className={styles.two}>
            {two}
        </div>
        <div className={styles.eight}>
            {children}
        </div>
    </div>;
}