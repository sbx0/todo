import {useRef} from "react";
import {XIcon} from "@primer/octicons-react";

export default function Model({show, close, children}) {
    const modelRef = useRef(null);
    const closeModel = (e) => {
        if (modelRef.current && show && !modelRef.current.contains(e.target)) {
            close();
        }
    }

    // just for next.js
    if (typeof document !== 'undefined') {
        document.addEventListener('mousedown', closeModel);
    }

    if (show) {
        return <div className="container">
            <div ref={modelRef} className="innerContainer">
                <div className="header">
                    <div className="close" onClick={close}>
                        <XIcon size={24}/>
                    </div>
                </div>
                {children}
            </div>
            <style jsx>{`
              .header {
                width: 100%;
                height: 20px;
                margin-bottom: 20px;
              }

              .close {
                height: 100%;
                float: right;
                cursor: pointer;
              }

              .container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                overflow-y: auto;
                overflow-x: hidden;
                background-color: rgba(19, 19, 19, 0.82);
                z-index: 10;
              }

              .container::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                background-color: rgba(245, 245, 245, 0);
              }

              .container::-webkit-scrollbar {
                width: 5px;
                height: 5px;
                background-color: rgba(245, 245, 245, 0);
              }

              .container::-webkit-scrollbar-thumb {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
                background-color: #555;
              }

              .innerContainer {
                max-width: 750px;
                height: max-content;
                overflow: auto;
                width: 90vw;
                margin: 20px auto;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.16);
                border-radius: 5px;
                background-color: rgb(19, 19, 19)
              }
            `}</style>
        </div>
    } else {
        return <></>;
    }
}