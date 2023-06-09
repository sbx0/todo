import {useEffect, useState} from "react";
import styles from "./NavBar.module.css";
import {callApi} from "../../apis/request";
import {CategoryPaging, POST} from "../../apis/apiPath";

function Category({onClick, onDrop, one, showNumber}) {
    const [hover, setHover] = useState(false);

    return <div
        onClick={onClick}
        onDrop={(event) => {
            setHover(false);
            onDrop(event);
        }}
        onDragOver={(event) => {
            setHover(true);
            event.preventDefault();
        }}
        onDragLeave={(event) => {
            setHover(false);
            event.preventDefault();
        }}
        className={`${styles.item} ${hover ? styles.itemHover : ""}`}>
        <div className={`${styles.number}`}>
            {showNumber}
        </div>
        {`${one.categoryName}`}
    </div>;
}

export default function NavBar({loadTasks, categoryId, taskTotal, backToTop, changeTaskCategory}) {
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

    const onDrop = (event, categoryId) => {
        let id = parseInt(event.dataTransfer.getData('text'));
        changeTaskCategory(id, categoryId);
        event.preventDefault();
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.category}`}>标签</div>
        {categories.map((one) =>
            <Category key={one.id}
                      onClick={() => {
                          loadTasks(1, 20, one.id, 0);
                          backToTop();
                          history.pushState('', '', "/task/" + one.id);
                      }}
                      onDrop={(event) => {
                          if (one.id !== 0 && one.id !== categoryId) {
                              onDrop(event, one.id)
                          }
                      }}
                      showNumber={showNumber(total[one.id])}
                      one={one}/>)
        }
    </div>
}