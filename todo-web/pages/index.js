import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";
import {listApi, saveApi, updateApi} from "../apis/taskApi";

export default function Home() {
  const [list, setList] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    listApi({page: 1, pageSize: 20}).then((res) => {
      setList(res.data)
    })
  }, []);

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
      taskName: taskName
    }).then(() => {
      listApi({page: 1, pageSize: 20}).then(r => setList(r.data));
    })
  }

  const setTaskStatusCompleted = (task) => {
    updateApi({
      ...task,
      taskStatus: 1
    }).then(() => {
      listApi({page: 1, pageSize: 20}).then(r => setList(r.data));
    })
  }

  const setTaskStatusUndo = (task) => {
    updateApi({
      ...task,
      taskStatus: 0
    }).then(() => {
      listApi({page: 1, pageSize: 20}).then(r => setList(r.data));
    })
  }

  return (
      <div className={styles.container}>
        <Head>
          <title>Next Todo App</title>
          <meta name="description" content="Generated by create next app"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={styles.main}>
          <div className={styles.contentArea}>
            {list.map((one) =>
                <div key={'taskInfo_' + one.id}
                     className={`${styles.taskItemBody} ${1 === one.taskStatus
                         ? styles.taskItemBodyCompleted : ''}`}>
                  <div className={styles.taskCheckIconContainer}>
                    {one?.taskStatus ?
                        <svg fill="currentColor" width="20"
                             height="20" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg"
                             focusable="false"
                             onClick={() => setTaskStatusUndo(one)}>
                          <path
                              d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 100 14 7 7 0 000-14zm3.36 4.65c.17.17.2.44.06.63l-.06.07-4 4a.5.5 0 01-.64.07l-.07-.06-2-2a.5.5 0 01.63-.77l.07.06L9 11.3l3.65-3.65c.2-.2.51-.2.7 0z"
                              fill="currentColor"></path>
                        </svg>
                        :
                        <svg fill="currentColor" width="20"
                             height="20" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg"
                             focusable="false"
                             onClick={() => setTaskStatusCompleted(one)}>
                          <path
                              d="M10 3a7 7 0 100 14 7 7 0 000-14zm-8 7a8 8 0 1116 0 8 8 0 01-16 0z"
                              fill="currentColor"></path>
                        </svg>
                    }
                  </div>
                  <div className={styles.taskNameContainer}>
                    {one.taskName}
                  </div>
                </div>)
            }
          </div>
          <div className={styles.operationArea}>
            <label htmlFor='taskInput'
                   className={styles.taskLabel}>
              New Task
            </label>
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
          </div>
        </main>
      </div>
  )
}
