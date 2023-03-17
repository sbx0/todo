import styles from "./TaskInput.module.css";
import {callApi} from "../../apis/request";
import {useState} from "react";
import TaskCategory from "./TaskCategory";
import {useRouter} from "next/router";
import {POST} from "../../apis/apiPath";

export default function TaskInput({categoryId, initData, setCategoryId, saveEvent, clickEvent}) {
    const router = useRouter()
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
        callApi({
            method: POST,
            url: '/api/task/save',
            params: {
                taskName: taskName,
                categoryId: categoryId
            }
        }).then((r) => {
            saveEvent(r.data)
        })
    }

    return <>
        <TaskCategory initData={initData}
                      categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      clickEvent={clickEvent}/>
        <input type='text'
               id='taskInput'
               placeholder={process.env.NODE_ENV === 'development' ? 'THIS IS DEV ENV!!!' : 'Input New Task'}
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
