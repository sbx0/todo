export default function Button({onClick, children}) {
    return <>
        <button onClick={onClick}
                className="button">
            {children}
        </button>
        <style jsx>{`
          .button {
            font-size: 16px;
            padding: 10px;
            height: max-content;
            width: 100%;
            background-color: #262a2d;
            color: #f7f7f7;
            border-radius: 5px;
            border: 0;
            cursor: pointer;
          }
        `}</style>
    </>
}