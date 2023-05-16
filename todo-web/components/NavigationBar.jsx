import {useRouter} from "next/router";
import {buildPath} from "../apis/request";
import {FileMediaIcon, GraphIcon, PersonIcon, TableIcon, TasklistIcon} from "@primer/octicons-react";

export default function NavigationBar({active}) {
    const router = useRouter()

    const bars = [
        {
            id: 'navigation_bar_home',
            name: 'navigation_bar',
            value: 0,
            path: '/',
            label: <TasklistIcon size={24}/>
        },
        {
            id: 'navigation_bar_calendar',
            name: 'navigation_bar',
            value: 1,
            path: '/task/view/calendar',
            label: <TableIcon size={24}/>
        },
        {
            id: 'navigation_bar_asset',
            name: 'navigation_bar',
            value: 2,
            path: '/asset',
            label: <GraphIcon size={24}/>
        },
        {
            id: 'navigation_bar_car',
            name: 'navigation_bar',
            value: 3,
            path: '/car',
            label: <FileMediaIcon size={24}/>
        },
        {
            id: 'navigation_bar_login',
            name: 'navigation_bar',
            value: 4,
            path: '/login',
            label: <PersonIcon size={24}/>
        }
    ];

    return <div className="container">
        <div className="centerContainer">
            <div className="itemContainer">
                {
                    bars.map((one) => <div key={one.id} className="item">
                        <input id={one.id}
                               name={one.name}
                               type="radio"
                               defaultChecked={active === one.value}
                               value={one.value}
                               onClick={event => {
                                   if (active !== one.value) {
                                       router.push(buildPath(one.path, router.query)).then(r => r);
                                   }
                                   event.preventDefault();
                               }}
                               hidden/>
                        <div className="categoryItemBackgroundColor">
                            <label className="categoryLabel"
                                   htmlFor={one.id}>
                                {one.label}
                            </label>
                        </div>
                    </div>)
                }
            </div>
        </div>
        <style jsx>{`
          .container {
            width: 100vw;
            height: 50px;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 9999;
          }

          .centerContainer {
            height: 100%;
            max-width: 750px;
            margin: 0 auto;
          }

          .itemContainer {
            margin: 0 auto;
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: inline-grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          }

          .item {
            width: 100%;
            height: 100%;
            font-size: 16px;
            cursor: pointer;
          }

          .categoryLabel {
            width: 100%;
            height: 35px;
            line-height: 35px;
            vertical-align: middle;
            margin: 0 auto;
            cursor: pointer;
          }

          .categoryItemBackgroundColor {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-items: center;
            margin: 0 auto;
            cursor: pointer;
            text-align: center;
            background: #24292f;
          }

          .categoryItemBackgroundColor:hover {
            background: #4b5057;
          }

          input[type='radio']:checked + .categoryItemBackgroundColor {
            color: #ffffff;
            background: #373b41;
          }
        `}</style>
    </div>;
}
