"use client";

import {createContext, useContext, useState} from "react";
import {callApi} from "../../../../apis/request";
import {POST, TaskPaging} from "../../../../apis/apiPath";

export function useTasksContext() {
    return useContext(TasksContext);
}

const TasksContext = createContext(null);

export default function TasksProvider({children}) {
    const [tasks, setTasks] = useState([]);
    const [params, setParams] = useState({
        page: 1,
        pageSize: 20,
        categoryId: 0,
        taskStatus: 0
    });
    const [others, setOthers] = useState({
        isMore: true,
        total: 0
    });

    const fetchTasks = (page = 1,
                        pageSize = 20,
                        categoryId = 0,
                        taskStatus = 0) => {
        if (page > 1 && !others.isMore) {
            return;
        }
        callApi({
            method: POST, url: TaskPaging, params: {
                page: page,
                pageSize: pageSize,
                categoryId: categoryId,
                taskStatus: taskStatus
            }
        }).then(r => {
            if (r.success) {
                let key = `${page}-${pageSize}-${categoryId}-${taskStatus}-`
                let newData;
                if (r.common.page === 1) {
                    newData = [];
                } else {
                    newData = tasks;
                }
                for (let i = 0; i < r.data.length; i++) {
                    newData.push({
                        key: key + r.data[i].id,
                        ...r.data[i]
                    });
                }
                setTasks(newData);
                setParams({
                    page: r.common.page,
                    pageSize: r.common.pageSize,
                    categoryId: categoryId,
                    taskStatus: taskStatus
                })
                if (r.data.length < r.common.pageSize) {
                    setOthers({isMore: false, total: r.common.total});
                } else {
                    setOthers({isMore: true, total: r.common.total});
                }
            }
        });
    }

    const addTask = (taskName, pageSize = 20, categoryId = 0, taskStatus = 0) => {
        if (taskName == null || taskName === '' || taskName.trim() === '') {
            return;
        }
        if (categoryId === 0) {
            return;
        }
        callApi({
            method: POST,
            url: '/api/task/save',
            params: {
                taskName: taskName.trim(),
                categoryId: categoryId
            }
        }).then((r) => {
            if (r.success) {
                fetchTasks(1, pageSize, categoryId, taskStatus);
            }
        });
    }

    return <TasksContext.Provider value={{
        tasks, setTasks,
        params, setParams,
        others, setOthers,
        fetchTasks, addTask
    }}>
        {children}
    </TasksContext.Provider>;
}