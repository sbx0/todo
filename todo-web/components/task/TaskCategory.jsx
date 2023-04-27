import {getCache, setCache} from "../Cache";
import useCategory from "../../hooks/useCategory";

const CURRENT_CATEGORY_CACHE_KEY = 'current-category';

export function getCurrentCategory() {
    if (typeof window === 'undefined') {
        return 0;
    }
    let currentCategory = getCache(CURRENT_CATEGORY_CACHE_KEY);
    if (currentCategory == null) {
        setCache(CURRENT_CATEGORY_CACHE_KEY, 0)
        currentCategory = 0;
    }
    return parseInt(currentCategory);
}

export default function TaskCategory({clickEvent}) {
    const category = useCategory(1, 20);
    const categoryId = getCurrentCategory();

    function clickCategory(value) {
        clickEvent(value);
        // cache category
        setCache(CURRENT_CATEGORY_CACHE_KEY, value);
    }

    return <div className="categoryContainer">
        <div className="categoryScrollBar">
            <div className="categoryItem">
                <input id={'category_default'}
                       name={'category'}
                       type="radio"
                       defaultChecked={categoryId === 0}
                       value={0}
                       onClick={event => {
                           setCache('categoryId', event.target.value);
                           clickCategory(event.target.value);
                       }}
                       hidden/>
                <div className="categoryItemBackgroundColor">
                    <label className="categoryLabel"
                           htmlFor={'category_default'}>
                        全部
                    </label>
                </div>
            </div>
            {
                category?.response?.data?.map((one, index) => {
                    return <div key={one.id + one.categoryName}
                                className="categoryItem">
                        <input id={'category_' + one.id}
                               name={'category'}
                               type="radio"
                               value={one.id}
                               defaultChecked={categoryId === one.id}
                               onClick={event => {
                                   setCache('categoryId', event.target.value);
                                   clickCategory(event.target.value);
                               }}
                               hidden/>
                        <div className="categoryItemBackgroundColor">
                            <label className="categoryLabel"
                                   htmlFor={'category_' + one.id}>
                                {one.categoryName}
                            </label>
                        </div>
                    </div>
                })
            }
        </div>
        <style jsx>{`
          .categoryContainer {
            margin: 0 auto;
            width: 100%;
            height: 60px;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 5px;
            z-index: 9999;
          }

          .categoryScrollBar {
            height: inherit;
            width: max-content;
          }

          .categoryContainer::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            background-color: rgba(245, 245, 245, 0);
          }

          .categoryContainer::-webkit-scrollbar {
            width: 12px;
            height: 5px;
            background-color: rgba(245, 245, 245, 0);
          }

          .categoryContainer::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
            background-color: #555;
          }

          .categoryItem {
            display: inline-block;
            width: 100px;
            height: 35px;
            margin: 10px 10px 10px 0;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
          }

          .categoryItem:last-child {
            margin: 10px 0 10px 0;
          }

          .categoryLabel {
            width: 100%;
            height: 35px;
            line-height: 35px;
            vertical-align: middle;
            margin: 0 auto;
            border-radius: 5px;
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
            background-color: #262a2d;
            border: 0;
            border-radius: 5px;
            transition: background-color 200ms;
          }

          input[type='radio']:checked + .categoryItemBackgroundColor {
            color: #ffffff;
            background-color: #0c8a25;
          }
        `}</style>
    </div>;
}
