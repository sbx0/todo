import {useEffect, useState} from "react";
import styles from "./TaskCategory.module.css";
import {listApi} from "../../apis/category";
import {setCache} from "../Cache";

export default function TaskCategory({categoryId, setCategoryId}) {
    const [list, setList] = useState([]);

    useEffect(() => {
        listApi({page: 1, pageSize: 20}, true).then((res) => {
            setList(res.data)
        })
    }, []);

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
                list.map((one, index) => {
                    return <div key={one.id + one.categoryName}
                                className={styles.categoryItem}>
                        <input id={'category_' + one.id}
                               name={'category'}
                               type="radio"
                               value={one.id}
                               defaultChecked={categoryId === one.id}
                               onClick={event => {
                                   setCache('categoryId', event.target.value);
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
