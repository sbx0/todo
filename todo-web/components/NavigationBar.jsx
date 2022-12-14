import styles from "./NavigationBar.module.css";

export default function NavigationBar() {
    return <div className={styles.container}>
        <div className={styles.itemContainer}>
            <div className={styles.item}>
                <input id={'navigation_bar_home'}
                       name={'navigation_bar'}
                       type="radio"
                       defaultChecked
                       value={0}
                       onClick={event => {
                       }}
                       hidden/>
                <div className={styles.categoryItemBackgroundColor}>
                    <label className={styles.categoryLabel}
                           htmlFor={'navigation_bar_home'}>
                        Home
                    </label>
                </div>
            </div>
            <div className={styles.item}>
                <input id={'navigation_bar_setting'}
                       name={'navigation_bar'}
                       type="radio"
                       defaultChecked
                       value={0}
                       onClick={event => {
                       }}
                       hidden/>
                <div className={styles.categoryItemBackgroundColor}>
                    <label className={styles.categoryLabel}
                           htmlFor={'navigation_bar_setting'}>
                        Setting
                    </label>
                </div>
            </div>
        </div>
    </div>;
}
