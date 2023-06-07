import {useRef} from "react";
import styles from "./Model.module.css";
import {XIcon} from "@primer/octicons-react";
import animations from "../../styles/animation.module.css";

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
        return <div className={`${styles.container} ${show ? animations.fadeIn : animations.fadeOut}`}>
            <div ref={modelRef} className={`${styles.innerContainer}`}>
                <div className={`${styles.header}`}>
                    <div className={`${styles.close}`} onClick={close}>
                        <XIcon size={24}/>
                    </div>
                </div>
                {children}
            </div>
        </div>
    } else {
        return <></>;
    }
}