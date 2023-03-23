export default function AssetType({value, initData, callback}) {
    const name = 'asset_type';
    const clickEvent = (value) => {
        callback(value);
    }

    return <div className="container">
        <div className="scrollBar">
            {
                initData.map((one) => <div key={one.id} className="item">
                    <input id={name + '_' + one.typeName}
                           name={name}
                           type="radio"
                           defaultChecked={value === one.id}
                           value={one.id}
                           onClick={event => {
                               clickEvent(event.target.value);
                           }}
                           hidden/>
                    <div className="itemBackgroundColor">
                        <label className="label"
                               htmlFor={name + '_' + one.typeName}>
                            {one.typeName}
                        </label>
                    </div>
                </div>)
            }
        </div>
        <style jsx>{`
          .container {
            margin: 0 auto;
            width: 100%;
            height: 60px;
            overflow-x: overlay;
            overflow-y: hidden;
            padding-bottom: 5px;
            z-index: 9999;
          }

          .scrollBar {
            height: inherit;
            width: max-content;
          }

          .container::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            background-color: rgba(245, 245, 245, 0);
          }

          .container::-webkit-scrollbar {
            width: 12px;
            height: 5px;
            background-color: rgba(245, 245, 245, 0);
          }

          .container::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
            background-color: #555;
          }

          .item {
            display: inline-block;
            width: 100px;
            height: 35px;
            margin: 10px 5px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
          }

          .label {
            width: 100%;
            height: 35px;
            line-height: 35px;
            vertical-align: middle;
            margin: 0 auto;
            border-radius: 5px;
            cursor: pointer;
          }

          .itemBackgroundColor {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-items: center;
            margin: 0 auto;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            background: rgba(0, 153, 36, 0.3);
          }

          .itemBackgroundColor:hover {
            background: rgba(0, 153, 36, 0.6);
          }

          input[type='radio']:checked + .itemBackgroundColor {
            color: #ffffff;
            background: #009924;
          }

          @keyframes slideFadeDown {
            0% {
              transform: translate3d(-100%, 0, 0);
              opacity: 0
            }
            100% {
              transform: translate3d(0, 0, 0);
              opacity: 1
            }
          }
        `}</style>
    </div>
}
