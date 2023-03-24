import {useState} from "react";
import {buildPath} from "../apis/request";
import Loading from "./Loading";
import {useRouter} from "next/router";
import TaskInput from "./task/TaskInput";
import {getCurrentCategory} from "./task/TaskCategory";

import dynamic from 'next/dynamic'

const StatisticsPanel = dynamic(() => import("./StatisticsPanel"), {
    loading: () => {
        return <>
            <div className="loading">

            </div>
            <style jsx>{`
              .loading {
                width: 100%;
                height: 53px;
              }
            `}</style>
        </>
    },
    ssr: false,
})

const TaskPage = dynamic(() => import("./TaskPage"), {
    loading: () => {
        return <>
            <div className="loading">

            </div>
            <style jsx>{`
              .loading {
                width: 100%;
                height: 600px;
              }
            `}</style>
        </>
    },
    ssr: false,
})

export default function TaskList({taskStatus}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [categoryId, setCategoryId] = useState(getCurrentCategory());

    const taskPages = []
    for (let i = 1; i <= page; i++) {
        taskPages.push(<TaskPage page={i}
                                 pageSize={pageSize}
                                 taskStatus={taskStatus}
                                 categoryId={categoryId}
                                 key={i}/>)
    }

    const categoryClickEvent = (categoryId) => {
        setPage(1);
        setCategoryId(categoryId);
    }

    const saveEvent = (task) => {
        router.push(buildPath("/", router.query)).then(r => r);
    }

    return <>
        <StatisticsPanel/>
        <TaskInput saveEvent={saveEvent}
                   setLoading={setLoading}
                   clickEvent={categoryClickEvent}/>
        <div className="taskItemList">
            {taskPages}
            <button className="button" onClick={() => {
                setPage(page + 1)
            }}>
                加载更多...
            </button>
        </div>
        <Loading active={loading}/>
        <style jsx>{`
          .button {
            height: 40px;
            width: 100%;
            margin-top: 5px;
            margin-bottom: 5px;
            background-color: #262a2d;
            color: #f7f7f7;
            border-radius: 5px;
            border: 0;
            cursor: pointer;
          }

          .taskItemList {
            margin-bottom: 10px;
          }
        `}</style>
    </>;
}
