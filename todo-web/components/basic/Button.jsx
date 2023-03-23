export default function Button({onClick, name}) {
    return <>
        <button onClick={onClick}
                className="button">
            {name}
        </button>
        <style jsx>{`
          .button {
            width: 100%;
            height: 40px;
            line-height: 34px;
            font-size: 16px;
            text-align: center;
          }
        `}</style>
    </>
}