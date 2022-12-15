import {useState} from "react";
import styles from "./TaskCategory.module.css";
import {setCache} from "../Cache";
import useFetch from "../../hooks/useFetch";

export default function TaskCategory({categoryId, setCategoryId, setTaskPage}) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [loading, setLoading] = useState(false);
    const {data, refresh} = useFetch({
        method: 'POST',
        url: '/api/category/paging',
        params: {
            page: page, pageSize: pageSize
        },
        setLoading: setLoading
    });

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
                           setTaskPage(1);
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
                data?.map((one, index) => {
                    return <div key={one.id + one.categoryName}
                                className={styles.categoryItem}>
                        <input id={'category_' + one.id}
                               name={'category'}
                               type="radio"
                               value={one.id}
                               defaultChecked={categoryId === one.id}
                               onClick={event => {
                                   setCache('categoryId', event.target.value);
                                   setTaskPage(1);
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
