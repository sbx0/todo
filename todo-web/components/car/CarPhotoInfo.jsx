import FormatTime from "../time/FormatTime";

export default ({
                    lotName,
                    carPlateNum,
                    floorName,
                    areaName,
                    parkNo,
                    imgUrl,
                    createTime,
                }) => {
    return <div className="container">
        <div className="innerContainer">
            <div className="infoContainer">
                <div>
                    <p>车位地址：</p>
                    <p>更新时间：</p>
                </div>

                <div className="textRight">
                    <p className="bolder">{parkNo}</p>
                    <p>
                        <FormatTime time={createTime}/>
                    </p>
                </div>
            </div>
            <div>
                <img className="img" src={imgUrl}/>
            </div>
        </div>
        <style jsx>{`
          .container {
            max-width: 500px;
            width: 100%;
            margin: 0 auto;
          }

          .innerContainer {
            margin: 0 auto;
            display: inline-grid;
            grid-template-columns: 1fr;
          }

          .infoContainer {
            font-size: 16px;
            margin: 10px;
            display: inline-grid;
            grid-template-columns: 1fr 1fr;
          }

          .img {
            width: 100%;
            height: 100%;
            border: 1px solid white;
            border-radius: 5px;
            overflow: hidden;
          }

          .textRight {
            text-align: right;
          }

          .title {
            font-size: 25px;
          }

          .bolder {
            font-weight: bolder;
          }
        `}</style>
    </div>
}