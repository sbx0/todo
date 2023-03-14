import styles from "./NavigationBar.module.css";
import {useRouter} from "next/router";
import {buildPath} from "../apis/taskApi";
import {FileMediaIcon, GraphIcon, ListUnorderedIcon, TasklistIcon} from "@primer/octicons-react";

export default function NavigationBar({active}) {
    const router = useRouter()

    const bars = [
        {
            id: 'navigation_bar_home',
            name: 'navigation_bar',
            value: 0,
            path: '/',
            label: <TasklistIcon size={24}/>
        },
        {
            id: 'navigation_bar_done',
            name: 'navigation_bar',
            value: 1,
            path: '/done',
            label: <ListUnorderedIcon size={24}/>
        },
        {
            id: 'navigation_bar_asset',
            name: 'navigation_bar',
            value: 2,
            path: '/asset',
            label: <GraphIcon size={24}/>
        },
        {
            id: 'navigation_bar_car',
            name: 'navigation_bar',
            value: 3,
            path: '/car',
            label: <FileMediaIcon size={24}/>
        }
    ];

    return <div className={styles.container}>
        <div className={styles.centerContainer}>
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
        </div>
    </div>;
}
