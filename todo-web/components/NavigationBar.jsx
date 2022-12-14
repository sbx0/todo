import styles from "./NavigationBar.module.css";
import {useRouter} from "next/router";

export default function NavigationBar({active}) {
    const router = useRouter()

    return <div className={styles.container}>
        <div className={styles.itemContainer}>
            <div className={styles.item}>
                <input id={'navigation_bar_home'}
                       name={'navigation_bar'}
                       type="radio"
                       defaultChecked={active === 0}
                       value={0}
                       onClick={event => {
                           if (active !== 0) {
                               router.push("/").then(r => r);
                           }
                           event.preventDefault();
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
                       defaultChecked={active === 1}
                       value={1}
                       onClick={event => {
                           if (active !== 1) {
                               router.push("/setting").then(r => r);
                           }
                           event.preventDefault();
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
