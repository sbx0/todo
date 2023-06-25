"use client";

import {createContext, useContext, useState} from "react";
import {callApi} from "../../../../apis/request";
import {ApiPrefix, POST, TaskPaging, TaskSort} from "../../../../apis/apiPath";

export function useTasksContext() {
    return useContext(TasksContext);
}

const TasksContext = createContext(null);

export default function TasksProvider({children, initData, sortedData, categoryId}) {
    const [tasks, setTasks] = useState(initData);
    const [sortedTasks, setSortedTasks] = useState(sortedData);
    const [params, setParams] = useState({
        page: 1,
        pageSize: 20,
        categoryId: categoryId,
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

    const changeTask = (task) => {
        callApi({
            method: POST,
            url: '/api/task/update',
            params: task
        }).then((r) => {
            if (r.success) {
                let newTasks = [];
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id === task.id) {
                        newTasks.push(task);
                    } else {
                        newTasks.push(tasks[i]);
                    }
                }
                setTasks(newTasks);
            }
        });
    }

    const taskSort = (currentId) => {
        let nextId = null;
        if (sortedTasks != null && sortedTasks.length > 0) {
            nextId = sortedTasks[0].id;
        }
        let newTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === currentId) {
                sortedTasks.reverse();
                sortedTasks.push(tasks[i]);
                sortedTasks.reverse();
            } else {
                newTasks.push(tasks[i]);
            }
        }
        setTasks(newTasks);
        setSortedTasks([...sortedTasks]);
        callApi({
            method: POST,
            url: ApiPrefix + TaskSort,
            params: {
                currentId: currentId,
                nextId: nextId
            }
        }).then((r) => {
            if (r.success) {
                // fetchTasks(1, params.pageSize, params.categoryId, params.taskStatus);
            }
        });
    }
    const resetTaskSort = (currentId) => {
        let newTasks = [];
        for (let i = 0; i < sortedTasks.length; i++) {
            if (sortedTasks[i].id !== currentId) {
                newTasks.push(sortedTasks[i]);
            } else {
                tasks.reverse();
                tasks.push(sortedTasks[i]);
                tasks.reverse();
            }
        }
        setSortedTasks(newTasks);
        setTasks([...tasks]);
        callApi({
            method: POST,
            url: ApiPrefix + TaskSort,
            params: {
                currentId: currentId,
                reset: true
            }
        }).then((r) => {
            if (r.success) {
                // fetchTasks(1, params.pageSize, params.categoryId, params.taskStatus);
            }
        });
    }

    return <TasksContext.Provider value={{
        tasks, setTasks,
        sortedTasks, setSortedTasks,
        params, setParams,
        others, setOthers,
        fetchTasks, addTask, changeTask,
        taskSort, resetTaskSort
    }}>
        {children}
    </TasksContext.Provider>;
}