import {useEffect, useState} from "react";
import styles from "./TaskCategory.module.css";
import {listApi} from "../../apis/category";

export default function TaskCategory() {
  const [list, setList] = useState([]);

  useEffect(() => {
    listApi({page: 1, pageSize: 20}, false).then((res) => {
      setList(res.data)
    })
  }, []);

  return <div className={styles.categoryContainer}>
    {
      list.map((one, index) => {
        return <div key={one.id + one.categoryName}
                    className={styles.categoryItem}>
          {
            index === 0 ?
                <input id={'category_' + one.id}
                       name={'category'}
                       type="radio"
                       defaultChecked
                       hidden/>
                :
                <input id={'category_' + one.id}
                       name={'category'}
                       type="radio"
                       hidden/>
          }
          <label className={styles.categoryLabel}
                 htmlFor={'category_' + one.id}>{one.categoryName}</label>
        </div>
      })
    }
  </div>;
}
