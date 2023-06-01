import {CircleIcon} from "@primer/octicons-react";
import {useRef, useState} from "react";

export default function Beta() {
    const moveRef = useRef(null);
    const [markCompletedShow, setMarkCompletedShow] = useState(false);
    return <div className="main">
        <div className="leftNavBar">
            <div>

            </div>
        </div>
        <div className="rightContainer">
            <div className="taskContainer">
                <div draggable="true"
                     onDragStart={(event) => {
                         event.dataTransfer.dropEffect = "move";
                         setMarkCompletedShow(true);
                         moveRef.current = event.target;
                     }}
                     className="taskItem">
                    <div className="taskTime"><CircleIcon/></div>
                    <div/>
                    <div>任务1</div>
                    <div/>
                    <div><span className="taskTime">time</span></div>
                </div>
                <div draggable="true"
                     onDragStart={(event) => {
                         event.dataTransfer.dropEffect = "move";
                         setMarkCompletedShow(true);
                         moveRef.current = event.target;
                     }}
                     className="taskItem">
                    <div className="taskTime"><CircleIcon/></div>
                    <div/>
                    <div>任务2</div>
                    <div/>
                    <div><span className="taskTime">time</span></div>
                </div>
            </div>
            <div onDrop={(event) => {
                event.preventDefault();
                console.log(event.target.className)
                if (event.target.className.indexOf("dropzone") !== -1) {
                    moveRef.current.parentNode.removeChild(moveRef.current);
                    event.target.parentNode.parentNode.parentNode.appendChild(moveRef.current);
                    setMarkCompletedShow(false);
                }
            }}
                 onDragOver={(event) => event.preventDefault()}
                 className={`taskContainer ${markCompletedShow ? 'markCompleted' : ''}`}>
                <div className={`filler`} hidden={!markCompletedShow}>
                    <div className="textCenteredHorizontally">
                        <div className={`textCenteredVertically dropzone`}>
                            放置此处标记已完成
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style jsx>{`
          .main {
            width: 100vw;
            height: 100vh;
            display: grid;
            grid-template-columns: 2fr 8fr;
          }

          .leftNavBar {
            margin: 0 0;
            height: 100vh;
            background-color: #eaeaea;
          }

          .rightContainer {
            margin: 0 0;
            padding: 10px;
            height: 100vh;
            background-color: #f3f3f3;
          }

          .taskContainer {
            display: grid;
            gap: 10px;
            grid-template-columns: 1fr;
            padding: 10px;
            max-width: 714px;
            margin: 0 auto;
          }

          .taskItem {
            padding: 12px 16px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02), 0 2px 18px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            background-color: #fff;
            display: grid;
            grid-template-areas: "checkbox . content . time";
            grid-template-columns: auto 16px 1fr 16px auto;
            overflow: hidden;
            transition: color 200ms, background-color 200ms;
            cursor: pointer;
            -webkit-user-select: none;
            user-select: none;
          }

          .taskItem:hover {
            background-color: #f7f7f7;
          }

          .taskTime {
            color: #9b9b9b;
          }

          .markCompleted {
            margin: 0 auto;
            box-shadow: 0 1px 4px rgba(20, 255, 0, 0.34), 0 2px 18px rgba(20, 255, 0, 0.34);
            border-radius: 8px;
            color: rgba(110, 110, 110, 0.45);
          }

          .filler {
            min-height: 50px;
          }

          .textCenteredHorizontally {
            height: 100%;
            text-align: center;
            width: 100%;
            display: table;
          }

          .textCenteredVertically {
            display: table-cell;
            vertical-align: middle;
          }

        `}</style>
    </div>
}
