export default ({children, two}) => {
    return <div className="main">
        <div className="two">
            {two}
        </div>
        <div className="eight">
            {children}
        </div>
        <style jsx>{`
          .main {
            width: 100%;
            height: calc(100vh - 30px);
          }

          .two {
            display: inline-block;
            width: 20%;
            height: 100%;
            text-align: right;
          }

          .eight {
            display: inline-block;
            width: 80%;
            height: 100%;
            text-align: left;
          }
        `}</style>
    </div>;
}