export default function FoamBox({children, onClick, style}) {
    return <>
        <div className="container" style={style} onClick={onClick}>
            {children}
        </div>
        <style jsx>{`
          .container {
            width: 100%;
            padding: 10px 5px 0 5px;
          }
        `}</style>
    </>
}