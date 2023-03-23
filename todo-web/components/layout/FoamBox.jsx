export default function FoamBox({children}) {
    return <>
        <div className="container">
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