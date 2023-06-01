import {CircleIcon} from "@primer/octicons-react";

export default function Beta() {
    return <div className="main">
        <div className="leftNavBar">
            <div>

            </div>
        </div>
        <div className="rightContainer">
            <div className="taskContainer">
                <div className="taskItem">
                    <div className="taskTime"><CircleIcon/></div>
                    <div/>
                    <div>content</div>
                    <div/>
                    <div><span className="taskTime">time</span></div>
                </div>
                <div className="taskItem">
                    <div className="taskTime"><CircleIcon/></div>
                    <div/>
                    <div>content</div>
                    <div/>
                    <div><span className="taskTime">time</span></div>
                </div>
                <div className="taskItem">
                    <div className="taskTime"><CircleIcon/></div>
                    <div/>
                    <div>content</div>
                    <div/>
                    <div><span className="taskTime">time</span></div>
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

        `}</style>
    </div>
}
