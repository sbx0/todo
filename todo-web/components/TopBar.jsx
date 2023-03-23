export default () => {
    return <div className="main">
        <div className="left">
            <div id="title">
                Project Name
            </div>
        </div>
        <div className="center">
            <div id="search">
                Search
            </div>
        </div>
        <div className="right">
            <div id="more">
                More
            </div>
        </div>
        <style jsx>{`
          .main {
            width: 100%;
            height: 30px;
          }

          .left {
            display: inline-block;
            width: 20%;
            height: 30px;
            text-align: left;
          }

          .center {
            display: inline-block;
            width: 60%;
            height: 30px;
            text-align: center;
          }

          .right {
            display: inline-block;
            width: 20%;
            height: 30px;
            text-align: right;
          }
        `}</style>
    </div>;
}