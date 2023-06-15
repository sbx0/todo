import {useEffect, useState} from "react";
import styles from "./NavBar.module.css";

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

function ThemeSelect({theme, setTheme}) {
    const themes = [
        {key: 'light', name: "亮色模式"},
        {key: 'dark', name: "暗黑模式"},
    ];
    return <select defaultValue={theme}
                   onChange={(event) => {
                       setTheme(event.target.value);
                       localStorage.setItem("theme", event.target.value);
                   }}>
        {themes.map(
            (one) => <option key={one.key} value={one.key}>{one.name}</option>)
        }
    </select>;
}

export default function NavBar({
                                   loadTasks,
                                   categoryId,
                                   taskTotal,
                                   backToTop,
                                   changeTaskCategory,
                                   theme,
                                   setTheme,
                                   initCategories
                               }) {
    const [categories, setCategories] = useState(initCategories);
    const [total, setTotal] = useState([]);

    useEffect(() => {
        let t = [...total];
        t[categoryId] = taskTotal;
        setTotal(t);
    }, [categoryId]);

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
                          history.pushState('', '', "/tasks/" + one.id);
                      }}
                      onDrop={(event) => {
                          if (one.id !== 0 && one.id !== categoryId) {
                              onDrop(event, one.id)
                          }
                      }}
                      showNumber={showNumber(total[one.id])}
                      one={one}/>)
        }
        <div className={`${styles.category}`}>主题</div>
        <ThemeSelect theme={theme}
                     setTheme={setTheme}/>
    </div>
}