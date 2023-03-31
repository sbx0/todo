import {useEffect, useState} from "react";

export default function Empty() {
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log(data)
    }, []);


    return <>
        <div className="test">

        </div>
        <style jsx>{`
          .test {

          }
        `}</style>
    </>;
}