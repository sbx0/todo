import Model from "../model/Model";
import {useState} from "react";
import CountDown from "../time/CountDown";
import {CheckCircleFillIcon, CircleIcon} from "@primer/octicons-react";

export default function TaskItem({
                                     one,
                                     change
                                 }) {
    const [data, setData] = useState(one);
    let isCompleted = 1 === data.taskStatus;
    let isCompletedClassName = isCompleted ? "taskItemBodyCompleted" : '';
    let divClassName = `taskItemBody ${isCompletedClassName}`;
    const [modalShow, setModalShow] = useState(false);

    function changTask(task) {
        setData(task);
        change(task);
        setModalShow(false);
    }

    return <div>
        <div className={divClassName}>
            <div className="leftContainer"
                 onClick={() => {
                     if (isCompleted) {
                         data.taskStatus = 0;
                         change(data);
                         setData({
                             ...data,
                             taskStatus: 0
                         });
                     } else {
                         data.taskStatus = 1;
                         change(data);
                         setData({
                             ...data,
                             taskStatus: 1
                         });
                     }
                 }}>
                {isCompleted ?
                    <CheckCircleFillIcon/>
                    :
                    <CircleIcon/>
                }
            </div>
            {data.taskStatus === 0 && data.planTime != null ?
                <div onClick={() => setModalShow(true)} className="rightContainerWithCountDown">
                    <div className="textContainer">
                        <span className="textCenteredVertically">
                            {data.taskName}
                        </span>
                    </div>
                    <div className="textContainer">
                        <div className="textCenteredVertically time">
                            <CountDown time={data.planTime}/>
                        </div>
                    </div>
                </div>
                :
                <div onClick={() => setModalShow(true)} className="rightContainer">
                    <div className="textContainer">
                        <span className="textCenteredVertically">
                            {data.taskName}
                        </span>
                    </div>
                </div>
            }

        </div>
        <Model show={modalShow}
               close={() => setModalShow(false)}
               change={changTask}
               data={data}/>
        <style jsx>{`
          .taskItemBody {
            background-color: #2c2c2c;
            box-shadow: 0 0 1px rgb(0 0 0 / 10%), 0 2px 4px rgb(0 0 0 / 10%);
            margin-bottom: 8px;
            border-radius: 4px;
            padding: 0 10px;
            min-height: 52px;
            display: grid;
            grid-template-columns: 1fr 18fr;
            cursor: pointer;
          }

          .taskItemBody:hover {
            background-color: #484848;
            color: #f7f7f7;
          }

          .taskItemBodyCompleted {
            border: 1px solid rgba(0, 143, 34, 0.51);
          }

          .leftContainer {
            height: 100%;
            width: 100%;
            color: #00ff36;
            padding: 0;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }

          .rightContainerWithCountDown {
            width: 100%;
            display: grid;
            grid-template-columns: 2fr 1fr;
            vertical-align: middle;
          }

          .rightContainer {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
            vertical-align: middle;
          }

          .textContainer {
            width: 100%;
            height: 100%;
            color: #d2d2d2;
            position: relative;
          }

          .textCenteredVertically {
            width: 100%;
            font-size: 15px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            padding: 0 5px;
          }

          .time {
            text-align: right;
            font-size: 11px;
          }

          @keyframes slideFadeDown {
            0% {
              transform: translate3d(0, -100%, 0);
              opacity: 0
            }
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 1
            }
          }
        `}</style>
    </div>;
}
