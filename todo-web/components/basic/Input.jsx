export default function Input({id, type = 'text', defaultValue, onChange}) {
    return <>
        <input id={id}
               className="input"
               defaultValue={defaultValue}
               onChange={onChange}
               type={type}/>
        <style jsx>{`
          .input {
            width: 100%;
            height: 40px;
            font-size: 16px;
            display: block;
            margin: 10px auto;
            padding: 0 10px;
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
            padding: 1px 10px 0 10px;
            border-bottom: 2px solid rgba(0, 215, 53, 0.51);
          }
        `}</style>
    </>
}