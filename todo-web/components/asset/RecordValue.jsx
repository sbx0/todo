import styles from "./RecordValue.module.css";

export default function RecordValue({value, callback}) {
    const changeEvent = (value) => {
        callback(value);
    }

    return <div className={styles.container}>
        <input className={styles.input}
               type="number"
               value={value}
               onChange={event => changeEvent(event.target.value)}/>
    </div>
}
