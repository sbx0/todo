import styles from "./Button.module.css";

export default function Button({onClick, children, style}) {
    return <>
        <button onClick={onClick}
                style={style}
                className={`${styles.button}`}>
            {children}
        </button>
    </>
}