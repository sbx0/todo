import styles from "./TopBar.module.css"

export default () => {
    return <div className={styles.main}>
        <div className={styles.left}>
            <div id="title">
                Project Name
            </div>
        </div>
        <div className={styles.center}>
            <div id="search">
                Search
            </div>
        </div>
        <div className={styles.right}>
            <div id="more">
                More
            </div>
        </div>
    </div>;
}