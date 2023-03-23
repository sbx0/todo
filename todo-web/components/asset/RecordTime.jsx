export default function RecordTime({value, callback}) {
    const changeEvent = (value) => {
        callback(value);
    }

    return <div className="container">
        <input className="input"
               type="date"
               value={value}
               onChange={event => changeEvent(event.target.value)}/>
        <style jsx>{`
          .container {
            margin: 0 auto;
            width: 100%;
            height: 60px;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 5px;
            z-index: 9999;
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

          .input {
            width: 100%;
            height: 40px;
            font-size: 20px;
            display: block;
            margin: 5px auto 20px auto;
            z-index: 9999;
          }
        `}</style>
    </div>
}
