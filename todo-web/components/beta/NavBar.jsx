import {useEffect, useState} from "react";
import styles from "./NavBar.module.css";
import {callApi} from "../../apis/request";
import {CategoryPaging, POST} from "../../apis/apiPath";

export default function NavBar({loadTasks, categoryId, taskTotal, backToTop}) {
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState([]);

    useEffect(() => {
        let t = [...total];
        t[categoryId] = taskTotal;
        setTotal(t);
    }, [categoryId]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        callApi({
            method: POST, url: CategoryPaging, params: {
                page: 1,
                pageSize: 100,
                orders: [{name: "create_time", direction: "desc"}]
            }
        }).then(r => {
            if (r.success) {
                setCategories(r.data);
            }
        });
    };

    const showNumber = (number) => {
        if (number > 0) {
            return number;
        } else {
            return '';
        }
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.category}`}>标签</div>
        {categories.map((one) => <div key={one.id}
                                      onClick={() => {
                                          loadTasks(1, 20, one.id, 0);
                                          backToTop();
                                          history.pushState('', '', "/task/" + one.id);
                                      }}
                                      className={`${styles.item}`}>
            <div className={`${styles.number}`}>
                {showNumber(total[one.id])}
            </div>
            {`${one.categoryName}`}
        </div>)}
    </div>
}