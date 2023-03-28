export default function TextArea({id, defaultValue, onChange, rows = 3}) {
    return <>
        <textarea id={id}
                  rows={rows}
                  className="input"
                  defaultValue={defaultValue}
                  onChange={onChange}/>
        <style jsx>{`
          .input {
            width: 100%;
            min-height: 40px;
            font-size: 16px;
            display: block;
            margin: 10px auto;
            padding: 10px 10px;
            z-index: 9999;
            background: #262a2d;
            color: #fff;
            outline: none;
            border: 0;
            border-bottom: 1px solid rgba(0, 143, 34, 0.51);
            border-radius: 5px;
            transition: border-bottom-color 500ms;
          }

          .input:focus {
            border-bottom: 1px solid rgba(0, 215, 53, 0.51);
          }
        `}</style>
    </>
}