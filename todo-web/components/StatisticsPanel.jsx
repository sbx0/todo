import useStatistics from "../hooks/useStatistics";
import {getCurrentCategory} from "./task/TaskCategory";

export default function StatisticsPanel() {
    const statistics = useStatistics(getCurrentCategory());
    const initData = statistics.response.data;

    return <div className="container">
        <div className="item">
            <div className="itemTitle">
                未完成
            </div>
            <div className="itemValue">
                {initData.uncompleted}
            </div>
        </div>
        <div className="item">
            <div className="itemTitle">
                已完成
            </div>
            <div className="itemValue completed">
                {initData.completed}
            </div>
        </div>
        <style jsx>{`
          .container {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .item {
            width: 100%;
            height: 100%;
            text-align: center;
            margin: 0 auto;
          }

          .itemTitle {
            font-size: 13px;
            line-height: 13px;
            letter-spacing: 5px;
            text-indent: 5px;
            margin: 0;
            padding: 0;
          }

          .itemValue {
            font-size: 40px;
            line-height: 40px;
            font-weight: bolder;
            letter-spacing: 5px;
            text-indent: 5px;
          }

          .completed {
            color: #00ff36;
          }
        `}</style>
    </div>;
}
