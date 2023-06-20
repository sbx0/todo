import {useState} from "react";
import styles from "./NavBar.module.css";
import {useTasksContext} from "../../app/tasks/[category]/components/tasksContext";
import {callApi} from "../../apis/request";
import {POST} from "../../apis/apiPath";

function Category({onClick, onDrop, one}) {
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
                                   categoryId,
                                   backToTop,
                                   theme,
                                   setTheme,
                                   initCategories
                               }) {
    const {tasks, setTasks, fetchTasks} = useTasksContext();

    const changeTaskCategory = (id, categoryId) => {
        let changeTask = null;
        let newTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === id) {
                changeTask = {
                    ...tasks[i],
                    categoryId: categoryId
                };
            } else {
                newTasks.push(tasks[i]);
            }
        }
        if (changeTask == null) {
            return;
        }
        setTasks(newTasks);
        callApi({
            method: POST,
            url: '/api/task/update',
            params: changeTask
        }).then((r) => {
            if (!r.success) {
                setTasks([...tasks]);
            }
        });
    }

    const onDrop = (event, categoryId) => {
        let id = parseInt(event.dataTransfer.getData('text'));
        changeTaskCategory(id, categoryId);
        event.preventDefault();
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.category}`}>标签</div>
        {initCategories.map((one) =>
            <Category key={one.id}
                      onClick={() => {
                          fetchTasks(1, 20, one.id, 0);
                          backToTop();
                          history.pushState(null, "", "/tasks/" + one.id)
                      }}
                      onDrop={(event) => {
                          if (one.id !== 0 && one.id !== categoryId) {
                              onDrop(event, one.id)
                          }
                      }}
                      one={one}/>)
        }
        <div className={`${styles.category}`}>主题</div>
        <ThemeSelect theme={theme}
                     setTheme={setTheme}/>
    </div>
}