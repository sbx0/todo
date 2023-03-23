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
            font-size: 16px;
            height: 40px;
            line-height: 24px;
            padding-left: 10px;
            padding-right: 10px;
          }
        `}</style>
    </>
}