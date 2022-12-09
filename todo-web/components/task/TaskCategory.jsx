import {useEffect, useState} from "react";
import styles from "./TaskCategory.module.css";
import {listApi} from "../../apis/category";

export default function TaskCategory({categoryId, setCategoryId}) {
  const [list, setList] = useState([]);

  useEffect(() => {
    listApi({page: 1, pageSize: 20}, true).then((res) => {
      setList(res.data)
    })
  }, []);

  return <div className={styles.categoryContainer}>
    <div className={styles.categoryItem}>
      <input id={'category_default'}
             name={'category'}
             type="radio"
             defaultChecked
             value={0}
             onClick={event => setCategoryId(event.target.value)}
             hidden/>
      <label className={styles.categoryLabel}
             htmlFor={'category_default'}>
        Default
      </label>
    </div>
    {
      list.map((one, index) => {
        return <div key={one.id + one.categoryName}
                    className={styles.categoryItem}>
          <input id={'category_' + one.id}
                 name={'category'}
                 type="radio"
                 value={one.id}
                 onClick={event => setCategoryId(event.target.value)}
                 hidden/>
          <label className={styles.categoryLabel}
                 htmlFor={'category_' + one.id}>
            {one.categoryName}
          </label>
        </div>
      })
    }
  </div>;
}
