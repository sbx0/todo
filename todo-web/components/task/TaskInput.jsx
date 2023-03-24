import {callApi} from "../../apis/request";
import {useState} from "react";
import {getCurrentCategory} from "./TaskCategory";
import {POST} from "../../apis/apiPath";
import TaskItem from "./TaskItem";
import dynamic from 'next/dynamic'

const TaskCategory = dynamic(() => import("./TaskCategory"), {
    loading: () => {
        return <>
            <div className="loading">

            </div>
            <style jsx>{`
              .loading {
                width: 100%;
                height: 60px;
              }
            `}</style>
        </>
    },
    ssr: false,
})

export default function TaskInput({saveEvent, clickEvent, setLoading}) {
    const [newTask, setNewTask] = useState('');
    const [newTaskData, setNewTaskData] = useState([]);
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
        setLoading(true);
        callApi({
            method: POST,
            url: '/api/task/save',
            params: {
                taskName: taskName,
                categoryId: getCurrentCategory()
            }
        }).then((r) => {
            saveEvent(r.data);
            let newData = newTaskData.slice(0);
            newData.push(r.data);
            setNewTaskData(newData);
        }).finally(() => {
            setLoading(false);
        })
    }

    const changeTask = (task) => {
        callApi({
            method: POST,
            url: '/api/task/update',
            params: task
        }).then(() => {

        }).finally(() => {

        })
    }

    function categoryClickEvent(value) {
        setNewTaskData([]);
        clickEvent(value);
    }

    return <>
        <TaskCategory clickEvent={categoryClickEvent}/>
        <input type='text'
               id='taskInput'
               placeholder={process.env.NODE_ENV === 'development' ? 'THIS IS DEV ENV!!!' : 'Input New Task'}
               className="taskInput"
               value={newTask}
               onChange={(event) => setNewTask(event.target.value)}
               onKeyDown={event => {
                   if (event.key === 'Enter') {
                       saveNewTask();
                       event.preventDefault();
                       event.stopPropagation();
                   }
               }}/>
        {newTaskData.map((one) =>
            <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                      one={one}
                      change={changeTask}/>)}
        <style jsx>{`
          .taskInput {
            width: 100%;
            height: 40px;
            font-size: 20px;
            display: block;
            margin: 10px auto;
            z-index: 9999;
          }
        `}</style>
    </>;
}
