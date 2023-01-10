import styles from "./NavigationBar.module.css";
import {useRouter} from "next/router";
import {buildPath} from "../apis/taskApi";

export default function NavigationBar({active}) {
    const router = useRouter()

    const bars = [
        {
            id: 'navigation_bar_home',
            name: 'navigation_bar',
            value: 0,
            path: '/',
            label: 'Todo'
        },
        {
            id: 'navigation_bar_new',
            name: 'navigation_bar',
            value: 1,
            path: '/new',
            label: 'New'
        },
        {
            id: 'navigation_bar_done',
            name: 'navigation_bar',
            value: 2,
            path: '/done',
            label: 'Done'
        },
        {
            id: 'navigation_bar_dev',
            name: 'navigation_bar',
            value: 3,
            path: '/dev',
            label: 'Dev'
        }
    ];

    return <div className={styles.container}>
        <div className={styles.itemContainer}>
            {
                bars.map((one) => <div key={one.id} className={styles.item}>
                    <input id={one.id}
                           name={one.name}
                           type="radio"
                           defaultChecked={active === one.value}
                           value={one.value}
                           onClick={event => {
                               if (active !== one.value) {
                                   router.push(buildPath(one.path, router.query)).then(r => r);
                               }
                               event.preventDefault();
                           }}
                           hidden/>
                    <div className={styles.categoryItemBackgroundColor}>
                        <label className={styles.categoryLabel}
                               htmlFor={one.id}>
                            {one.label}
                        </label>
                    </div>
                </div>)
            }
        </div>
    </div>;
}
