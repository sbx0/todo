"use client";

import {createContext, useContext, useReducer} from "react";
import {callApi} from "../../../../apis/request";
import {ApiPrefix, POST, TaskPaging, TaskSort, TaskSortedPaging} from "../../../../apis/apiPath";
import toast, {Toaster} from 'react-hot-toast';

export function useTasksContext() {
    return useContext(TasksContext);
}

const TasksContext = createContext(null);

function tasksReducer(state, action) {
    if (action.type === 'saveData') {
        return {
            ...state,
            ...action.payload
        };
    }
    throw Error('Unknown action.');
}

export default function TasksProvider({children, initData, sortedData, categoryId}) {
    const [tasksState, tasksDispatch] = useReducer(tasksReducer, {
        page: 1,
        pageSize: 20,
        categoryId: categoryId,
        taskStatus: 0,
        isMore: true,
        total: 0,
        data: initData
    });
    const [sortedTasksState, sortedTasksDispatch] = useReducer(tasksReducer, {
        page: 1,
        pageSize: 20,
        categoryId: categoryId,
        taskStatus: 0,
        isMore: true,
        total: 0,
        data: sortedData
    });

    const fetchSortedTasks = (params) => {
        params = {
            page: sortedTasksState.page,
            pageSize: sortedTasksState.pageSize,
            categoryId: sortedTasksState.categoryId,
            ...params
        }
        if (params.page > 1 && !sortedTasksState.isMore) {
            return;
        }
        callApi({
            method: POST, url: TaskSortedPaging, params: params,
        }).then(r => {
            let key = `${params.page}-${params.pageSize}-${params.categoryId}-`
            let newData;
            if (r.common.page === 1) {
                newData = [];
            } else {
                newData = sortedTasksState.data;
            }
            for (let i = 0; i < r.data.length; i++) {
                newData.push({
                    key: key + r.data[i].id,
                    ...r.data[i]
                });
            }
            let payload = {
                data: newData,
                page: r.common.page,
                pageSize: r.common.pageSize,
                total: r.common.total,
                categoryId: params.categoryId,
                taskStatus: params.taskStatus
            }
            if (r.data.length < r.common.pageSize) {
                payload = {
                    ...payload,
                    isMore: false
                }
            } else {
                payload = {
                    ...payload,
                    isMore: true
                }
            }
            sortedTasksDispatch({type: 'saveData', payload: payload})
        });
    }

    const fetchTasks = (params) => {
        params = {
            page: tasksState.page,
            pageSize: tasksState.pageSize,
            categoryId: tasksState.categoryId,
            taskStatus: tasksState.taskStatus,
            ...params
        }
        if (params.page > 1 && !tasksState.isMore) {
            return;
        }
        callApi({
            method: POST, url: TaskPaging, params: params
        }).then(r => {
            if (r.success) {
                let key = `${params.page}-${params.pageSize}-${params.categoryId}-${params.taskStatus}-`
                let newData;
                if (r.common.page === 1) {
                    newData = [];
                } else {
                    newData = tasksState.data;
                }
                for (let i = 0; i < r.data.length; i++) {
                    newData.push({
                        key: key + r.data[i].id,
                        ...r.data[i]
                    });
                }
                let payload = {
                    data: newData,
                    page: r.common.page,
                    pageSize: r.common.pageSize,
                    total: r.common.total,
                    categoryId: params.categoryId,
                    taskStatus: params.taskStatus
                }
                if (r.data.length < r.common.pageSize) {
                    payload = {
                        ...payload,
                        isMore: false
                    }
                } else {
                    payload = {
                        ...payload,
                        isMore: true
                    }
                }
                tasksDispatch({type: 'saveData', payload: payload})
            }
        });
    }

    const addTask = (taskName) => {
        if (taskName == null || taskName === '' || taskName.trim() === '') {
            return;
        }
        if (tasksState.categoryId === 0) {
            return;
        }
        callApi({
            method: POST,
            url: '/api/task/save',
            params: {
                taskName: taskName.trim(),
                categoryId: tasksState.categoryId
            }
        }).then((r) => {
            if (r.success) {
                fetchTasks({page: 1});
                toast.success("已添加任务");
            } else {
                toast.error("添加任务失败");
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
                let isFind = false;
                for (let i = 0; i < tasksState.data.length; i++) {
                    if (tasksState.data[i].id === task.id) {
                        isFind = true;
                        newTasks.push(task);
                    } else {
                        newTasks.push(tasksState.data[i]);
                    }
                }
                if (isFind) {
                    tasksDispatch({type: 'saveData', payload: {data: newTasks}});
                } else {
                    let newSortedTasks = [];
                    for (let i = 0; i < sortedTasksState.data.length; i++) {
                        if (sortedTasksState.data[i].id === task.id) {
                            newSortedTasks.push(task);
                        } else {
                            newSortedTasks.push(sortedTasksState.data[i]);
                        }
                    }
                    sortedTasksDispatch({type: 'saveData', payload: {data: newSortedTasks}});
                }
                toast.success("已修改任务");
            } else {
                toast.error("修改任务失败");
            }
        });
    }

    const taskSort = (currentId) => {
        let nextId = null;
        let sortedTasks = [...sortedTasksState.data];
        if (sortedTasks.length > 0) {
            nextId = sortedTasks[0].id;
        }
        let newTasks = [];
        for (let i = 0; i < tasksState.data.length; i++) {
            if (tasksState.data[i].id === currentId) {
                sortedTasks.reverse();
                sortedTasks.push(tasksState.data[i]);
                sortedTasks.reverse();
            } else {
                newTasks.push(tasksState.data[i]);
            }
        }
        tasksDispatch({type: 'saveData', payload: {data: newTasks}});
        sortedTasksDispatch({type: 'saveData', payload: {data: sortedTasks}});
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
            } else {
                toast.error("任务排序失败");
            }
        });
    }
    const resetTaskSort = (currentId) => {
        let newTasks = [];
        let tasks = [...tasksState.data];
        for (let i = 0; i < sortedTasksState.data.length; i++) {
            if (sortedTasksState.data[i].id !== currentId) {
                newTasks.push(sortedTasksState.data[i]);
            } else {
                tasks.reverse();
                tasks.push(sortedTasksState.data[i]);
                tasks.reverse();
            }
        }
        tasksDispatch({type: 'saveData', payload: {data: tasks}});
        sortedTasksDispatch({type: 'saveData', payload: {data: newTasks}});
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
            } else {
                toast.error("重置任务排序失败");
            }
        });
    }

    const changeTaskCategory = (id, categoryId) => {
        let changeTask = null;
        let tasks = tasksState.data;
        let newTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === id) {
                changeTask = {
                    ...tasks[i],
                    categoryId: categoryId
                };
            } else {
                newTasks.push(tasks[i]);
            }
        }
        if (changeTask == null) {
            return;
        }
        tasksDispatch({type: 'saveData', payload: {data: newTasks}});
        callApi({
            method: POST,
            url: '/api/task/update',
            params: changeTask
        }).then((r) => {
            if (r.success) {
                toast.success("修改任务类别成功");
            } else {
                toast.error("修改任务类别失败");
                tasksDispatch({type: 'saveData', payload: {data: [...tasks]}});
            }
        });
    }

    return <TasksContext.Provider value={{
        fetchTasks, addTask, changeTask,
        taskSort, resetTaskSort, fetchSortedTasks,
        changeTaskCategory,
        sortedTasksState, sortedTasksDispatch,
        tasksState, tasksDispatch
    }}>
        {children}
        <Toaster/>
    </TasksContext.Provider>;
}