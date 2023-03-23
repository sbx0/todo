import styles from "./TaskCategory.module.css";
import {getCache, setCache} from "../Cache";
import {useEffect} from "react";

const CURRENT_CATEGORY_CACHE_KEY = 'current-category';

export function getCurrentCategory() {
    let currentCategory = getCache(CURRENT_CATEGORY_CACHE_KEY);
    if (currentCategory == null) {
        setCache(CURRENT_CATEGORY_CACHE_KEY, 0)
        currentCategory = 0;
    }
    return parseInt(currentCategory);
}

export default function TaskCategory({categoryId, setCategoryId, clickEvent, initData}) {

    useEffect(() => {
        console.log('getCurrentCategory', getCurrentCategory())
    }, [])

    function clickCategory(value) {
        clickEvent(value);
        // cache category
        setCache(CURRENT_CATEGORY_CACHE_KEY, value);
        console.log('getCurrentCategory', getCurrentCategory())
    }

    return <div className={styles.categoryContainer}>
        <div className={styles.categoryScrollBar}>
            <div className={styles.categoryItem}>
                <input id={'category_default'}
                       name={'category'}
                       type="radio"
                       defaultChecked={categoryId === 0}
                       value={0}
                       onClick={event => {
                           setCache('categoryId', event.target.value);
                           clickCategory(event.target.value);
                           setCategoryId(event.target.value)
                       }}
                       hidden/>
                <div className={styles.categoryItemBackgroundColor}>
                    <label className={styles.categoryLabel}
                           htmlFor={'category_default'}>
                        Default
                    </label>
                </div>
            </div>
            {
                initData?.map((one, index) => {
                    return <div key={one.id + one.categoryName}
                                className={styles.categoryItem}>
                        <input id={'category_' + one.id}
                               name={'category'}
                               type="radio"
                               value={one.id}
                               defaultChecked={categoryId === one.id}
                               onClick={event => {
                                   setCache('categoryId', event.target.value);
                                   clickCategory(event.target.value);
                                   setCategoryId(event.target.value);
                               }}
                               hidden/>
                        <div className={styles.categoryItemBackgroundColor}>
                            <label className={styles.categoryLabel}
                                   htmlFor={'category_' + one.id}>
                                {one.categoryName}
                            </label>
                        </div>
                    </div>
                })
            }
        </div>
    </div>;
}
