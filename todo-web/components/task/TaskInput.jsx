import styles from "./TaskInput.module.css";
import {saveApi} from "../../apis/taskApi";
import {useState} from "react";
import TaskCategory from "./TaskCategory";
import {getCache} from "../Cache";
import {useRouter} from "next/router";

export default function TaskInput() {
    const router = useRouter()
    const [categoryId, setCategoryId] = useState(() => {
        // just for next.js
        if (typeof window !== 'undefined') {
            let cache = getCache('categoryId');
            if (cache == null) {
                cache = '0';
            }
            return parseInt(cache);
        } else {
            return 0;
        }
    });
    const [newTask, setNewTask] = useState('');
    const saveNewTask = () => {
        let taskName = newTask;
        setNewTask('');
        if (taskName == null) {
            return;
        }
        if (taskName === '') {
            return;
        }
        if (taskName.trim() === '') {
            return;
        }
        saveApi({
            taskName: taskName,
            categoryId: categoryId
        }).then(() => {
            router.push('/').then(r => r)
        })
    }

    const categoryClickEvent = (value) => {
        console.log('categoryClickEvent', value)
        router.replace({
            query: {...router.query, categoryId: value},
        });
    }

    return <>
        <TaskCategory categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      clickEvent={categoryClickEvent}/>
        <input type='text'
               id='taskInput'
               placeholder='Input New Task'
               className={styles.taskInput}
               value={newTask}
               onChange={(event) => setNewTask(event.target.value)}
               onKeyDown={event => {
                   if (event.key === 'Enter') {
                       saveNewTask();
                       event.preventDefault();
                       event.stopPropagation();
                   }
               }}/>
    </>;
}
