import styles from "./NavBar.module.css";
import {callApi} from "../../apis/request";
import {CategoryPaging, POST} from "../../apis/apiPath";
import {useEffect, useState} from "react";

export default function NavBar({loadTasks}) {
    const [categories, setCategories] = useState([]);

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
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.category}`}>标签</div>
        {categories.map((one) => <div key={one.id}
                                      onClick={() => {
                                          loadTasks(1, 20, one.id, 0);
                                      }}
                                      className={`${styles.item}`}>
            {one.categoryName}
        </div>)}
    </div>
}