import styles from "./Button.module.css";

export default function Button({onClick, name}) {
    return <button onClick={onClick}
                   className={styles.button}>
        {name}
    </button>
}