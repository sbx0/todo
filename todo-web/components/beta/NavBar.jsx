import {useState} from "react";
import styles from "./NavBar.module.css";
import {useTasksContext} from "../../app/tasks/[category]/components/tasksContext";
import toast from "react-hot-toast";

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
    const {fetchTasks, fetchSortedTasks, changeTaskCategory} = useTasksContext();

    const onDrop = (event, categoryId) => {
        let id = parseInt(event.dataTransfer.getData('text'));
        changeTaskCategory(id, categoryId);
        event.preventDefault();
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.category}`}>类别</div>
        {initCategories.map((one) =>
            <Category key={one.id}
                      onClick={() => {
                          fetchSortedTasks({
                              page: 1,
                              categoryId: one.id
                          });
                          fetchTasks({
                              page: 1,
                              categoryId: one.id
                          });
                          backToTop();
                          history.pushState(null, "", "/tasks/" + one.id)
                      }}
                      onDrop={(event) => {
                          if (one.id === 0) {
                              toast.error("无法移动任务到全部类别");
                              return;
                          }
                          if (one.id === categoryId) {
                              toast.error("该任务已在目标类别");
                              return;
                          }
                          onDrop(event, one.id);
                      }}
                      one={one}/>)
        }
        <div className={`${styles.category}`}>主题</div>
        <ThemeSelect theme={theme}
                     setTheme={setTheme}/>
    </div>
}