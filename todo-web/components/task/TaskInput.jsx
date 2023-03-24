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
               placeholder={process.env.NODE_ENV === 'development' ? 'DEV VERSION WARNING' : '添加任务'}
               className="input"
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
          .input {
            width: 100%;
            height: 40px;
            font-size: 20px;
            display: block;
            margin: 10px auto;
            padding: 0 10px;
            z-index: 9999;
            background: #262a2d;
            color: #fff;
            outline: none;
            border: 0;
            border-bottom: 1px solid rgba(0, 143, 34, 0.51);
            border-radius: 5px;
            transition: border-bottom-color 500ms;
          }

          .input:focus {
            padding: 1px 10px 0 10px;
            border-bottom: 2px solid rgba(0, 215, 53, 0.51);
          }
        `}</style>
    </>;
}
