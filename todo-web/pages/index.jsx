import {useState} from "react";
import styles from '../styles/Home.module.css'
import TaskInput from "../components/task/TaskInput";
import TaskItem from "../components/task/TaskItem";

import {saveApi, updateApi} from "../apis/taskApi";
import Head from 'next/head'
import TaskCategory from "../components/task/TaskCategory";
import useFetch from "../hooks/useFetch";

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [newTask, setNewTask] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const taskPaging = useFetch('POST', '/api/task/paging', {
    page: page, pageSize: pageSize, categoryId: categoryId
  });

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
      taskPaging.refresh();
    })
  }

  const setTaskStatusCompleted = (task) => {
    updateApi({
      ...task,
      taskStatus: 1
    }).then(() => {
      taskPaging.refresh();
    })
  }

  const setTaskStatusUndo = (task) => {
    updateApi({
      ...task,
      taskStatus: 0
    }).then(() => {
      taskPaging.refresh();
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
          <div className={styles.operationArea}>
            <TaskInput newTask={newTask}
                       setNewTask={setNewTask}
                       saveNewTask={saveNewTask}/>
          </div>
          <div className={styles.contentArea}>
            <TaskCategory categoryId={categoryId}
                          setCategoryId={setCategoryId}/>
            {taskPaging.data?.map((one) =>
                <TaskItem key={'taskInfo_' + one.id}
                          one={one}
                          setTaskStatusUndo={setTaskStatusUndo}
                          setTaskStatusCompleted={setTaskStatusCompleted}/>)}
          </div>
        </main>
      </div>
  )
}
