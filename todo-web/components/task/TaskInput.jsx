import styles from "./TaskInput.module.css";

export default function TaskInput({
  newTask,
  setNewTask,
  saveNewTask
}) {
  return <>
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
